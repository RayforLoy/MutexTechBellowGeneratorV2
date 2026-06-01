#!/usr/bin/env python3
"""Manage built-in bellows configs in the static page.

Examples:
    python add_config_to_static_page.py --list
    python add_config_to_static_page.py -sort
    python add_config_to_static_page.py camera.json
    python add_config_to_static_page.py camera.json --name "My Camera"
    python add_config_to_static_page.py camera.json --name "My Camera" -sort
    python add_config_to_static_page.py --delete "My Camera" -sort
    python add_config_to_static_page.py --app-js app.js --list

The script edits the `BUILTIN_CONFIGS` array in `app.js`. After publishing the
static files, those configs are available from the project-name picker without
requiring each browser to import JSON manually.
"""

from __future__ import annotations

import argparse
import json
import re
from pathlib import Path
from typing import Any


CONFIG_FIELDS = [
    "wif",
    "hif",
    "wof",
    "hof",
    "wir",
    "hir",
    "wor",
    "hor",
    "woo",
    "odf",
    "odr",
    "frhd",
    "srd",
    "ribCornerRadius",
]

CONFIG_CHECKBOXES = [
    "enableSupportRibs",
    "useRectangularRibs",
    "useCornerlessRibs",
    "showBoundingBox",
    "rotateToBoundingBox",
    "enhanceMountFrame",
    "enableOverlap",
    "trimOverlapOutside",
]

DEFAULT_PARAMS = {
    "wif": 95,
    "hif": 83.3,
    "wof": 110,
    "hof": 110,
    "wir": 123.7,
    "hir": 125.6,
    "wor": 150,
    "hor": 150,
    "woo": 15,
    "odf": 12,
    "odr": 100,
    "frhd": 8,
    "srd": 0.5,
    "ribCornerRadius": 0.5,
    "enableSupportRibs": False,
    "useRectangularRibs": True,
    "useCornerlessRibs": False,
    "showBoundingBox": False,
    "rotateToBoundingBox": False,
    "enhanceMountFrame": True,
    "enableOverlap": True,
    "trimOverlapOutside": True,
}


def slugify(name: str) -> str:
    """Create the same kind of readable id used by the web app."""
    slug = re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")
    return slug or "config"


def js_string(value: str) -> str:
    """Render a string for direct use inside app.js."""
    return json.dumps(value, ensure_ascii=False)


def normalize_number(value: Any, fallback: float, min_value: float | None = None) -> float:
    """Read a numeric config value and clamp it when the UI expects a minimum."""
    try:
        number = float(value)
    except (TypeError, ValueError):
        number = fallback
    if min_value is not None:
        number = max(min_value, number)
    return int(number) if number.is_integer() else number


def positive_offset(value: Any, fallback: float = 0) -> float:
    return abs(normalize_number(value, fallback))


def normalize_bool(value: Any, fallback: bool) -> bool:
    """Accept booleans plus common string forms from hand-edited JSON files."""
    if isinstance(value, bool):
        return value
    if isinstance(value, str):
        return value.lower() not in {"false", "0", "off", "no"}
    if value is None:
        return fallback
    return bool(value)


def normalize_config(source: dict[str, Any], name_override: str | None = None) -> dict[str, Any]:
    """Convert exported JSON or raw params into the built-in config shape."""
    params = source.get("params") if isinstance(source.get("params"), dict) else source
    name = str(name_override or source.get("name") or params.get("name") or "Imported configuration").strip()
    if not name:
        name = "Imported configuration"

    normalized_params: dict[str, Any] = {}
    for field in CONFIG_FIELDS:
        if field == "odf":
            normalized_params[field] = positive_offset(params.get(field), DEFAULT_PARAMS[field])
            continue
        if field == "odr":
            normalized_params[field] = positive_offset(params.get(field), DEFAULT_PARAMS[field])
            continue
        min_value = 0 if field in {"woo", "srd", "ribCornerRadius"} else None
        if field in {"wif", "hif", "wof", "hof", "wir", "hir", "wor", "hor"}:
            min_value = 1
        normalized_params[field] = normalize_number(params.get(field), DEFAULT_PARAMS[field], min_value)

    for field in CONFIG_CHECKBOXES:
        normalized_params[field] = normalize_bool(params.get(field), DEFAULT_PARAMS[field])

    sections = params.get("sections")
    if not isinstance(sections, list) or not sections:
        sections = [{"lhs": 6, "nos": 4}, {"lhs": 10.3, "nos": 19}]
    normalized_params["sections"] = [
        {
            "lhs": normalize_number(section.get("lhs") if isinstance(section, dict) else None, 1, 0),
            "nos": max(1, round(normalize_number(section.get("nos") if isinstance(section, dict) else None, 1, 1))),
        }
        for section in sections
    ]

    return {
        "id": str(source.get("id") or slugify(name)),
        "name": name,
        "builtin": True,
        "params": normalized_params,
    }


def find_builtin_array(text: str) -> tuple[int, int]:
    """Return the character range for `const BUILTIN_CONFIGS = [...]`."""
    marker = "const BUILTIN_CONFIGS = ["
    start = text.find(marker)
    if start < 0:
        raise ValueError("Could not find `const BUILTIN_CONFIGS = [` in app.js")

    index = start + len(marker)
    depth = 1
    in_string: str | None = None
    escaped = False
    while index < len(text):
        char = text[index]
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == in_string:
                in_string = None
        elif char in {'"', "'", "`"}:
            in_string = char
        elif char == "[":
            depth += 1
        elif char == "]":
            depth -= 1
            if depth == 0:
                return start, index + 1
        index += 1
    raise ValueError("Could not find the end of BUILTIN_CONFIGS in app.js")


def builtin_array_body(text: str) -> str:
    start, end = find_builtin_array(text)
    marker = "const BUILTIN_CONFIGS = ["
    return text[start + len(marker) : end - 1]


def split_top_level_objects(body: str) -> list[str]:
    """Split the array body into object literals without being fooled by nested braces."""
    objects: list[str] = []
    start: int | None = None
    depth = 0
    in_string: str | None = None
    escaped = False
    for index, char in enumerate(body):
        if in_string:
            if escaped:
                escaped = False
            elif char == "\\":
                escaped = True
            elif char == in_string:
                in_string = None
            continue
        if char in {'"', "'", "`"}:
            in_string = char
            continue
        if char == "{":
            if depth == 0:
                start = index
            depth += 1
        elif char == "}":
            depth -= 1
            if depth == 0 and start is not None:
                objects.append(body[start : index + 1])
                start = None
    return objects


def parse_js_value(raw: str) -> Any:
    """Parse the simple values used in generated config blocks."""
    raw = raw.strip().rstrip(",")
    if raw in {"true", "false"}:
        return raw == "true"
    if raw in {"null", "undefined"}:
        return None
    if (raw.startswith('"') and raw.endswith('"')) or (raw.startswith("'") and raw.endswith("'")):
        return json.loads(raw if raw.startswith('"') else json.dumps(raw[1:-1]))
    try:
        number = float(raw)
        return int(number) if number.is_integer() else number
    except ValueError:
        return raw


def parse_config_object(block: str) -> dict[str, Any]:
    """Parse one generated config object from app.js into a Python dict."""
    config: dict[str, Any] = {"params": {}}
    id_match = re.search(r"\bid:\s*([\"'])(.*?)\1", block)
    name_match = re.search(r"\bname:\s*([\"'])(.*?)\1", block)
    config["id"] = id_match.group(2) if id_match else ""
    config["name"] = name_match.group(2) if name_match else ""
    config["builtin"] = True

    params_match = re.search(r"params:\s*\{([\s\S]*)\}\s*,?\s*$", block)
    params_block = params_match.group(1) if params_match else ""
    for field in CONFIG_FIELDS + CONFIG_CHECKBOXES:
        match = re.search(rf"\b{re.escape(field)}:\s*([^,\n]+)", params_block)
        config["params"][field] = parse_js_value(match.group(1)) if match else DEFAULT_PARAMS[field]

    sections_match = re.search(r"sections:\s*\[([\s\S]*?)\]\s*,?", params_block)
    sections: list[dict[str, Any]] = []
    if sections_match:
        for section_match in re.finditer(r"\{\s*lhs:\s*([^,}]+),\s*nos:\s*([^,}]+)\s*\}", sections_match.group(1)):
            sections.append({
                "lhs": parse_js_value(section_match.group(1)),
                "nos": parse_js_value(section_match.group(2)),
            })
    config["params"]["sections"] = sections or [{"lhs": 6, "nos": 4}, {"lhs": 10.3, "nos": 19}]
    return normalize_config(config)


def load_configs(app_js: Path) -> list[dict[str, Any]]:
    text = app_js.read_text(encoding="utf-8")
    return [parse_config_object(block) for block in split_top_level_objects(builtin_array_body(text))]


def render_config(config: dict[str, Any]) -> str:
    """Render one normalized config back into the app.js object-literal style."""
    params = config["params"]
    lines = [
        "  {",
        f"    id: {js_string(config['id'])},",
        f"    name: {js_string(config['name'])},",
        "    builtin: true,",
        "    params: {",
    ]
    for field in CONFIG_FIELDS + CONFIG_CHECKBOXES:
        lines.append(f"      {field}: {json.dumps(params[field], ensure_ascii=False)},")
    lines.append("      sections: [")
    for section in params["sections"]:
        lines.append(f"        {{ lhs: {json.dumps(section['lhs'])}, nos: {json.dumps(section['nos'])} }},")
    lines.extend(["      ],", "    },", "  },"])
    return "\n".join(lines)


def write_configs(app_js: Path, configs: list[dict[str, Any]]) -> None:
    """Replace the whole BUILTIN_CONFIGS array while preserving the rest of app.js."""
    text = app_js.read_text(encoding="utf-8")
    start, end = find_builtin_array(text)
    rendered = "const BUILTIN_CONFIGS = [\n" + "\n".join(render_config(config) for config in configs) + "\n]"
    app_js.write_text(text[:start] + rendered + text[end:], encoding="utf-8", newline="\n")


def make_unique_id(config: dict[str, Any], existing_ids: set[str]) -> None:
    base_id = slugify(config["name"]) if not config.get("id") else slugify(config["id"])
    candidate = base_id
    suffix = 2
    while candidate in existing_ids:
        candidate = f"{base_id}-{suffix}"
        suffix += 1
    config["id"] = candidate
    existing_ids.add(candidate)


def config_sort_key(config: dict[str, Any]) -> tuple[Any, ...]:
    """Sort names naturally, so Camera 2 comes before Camera 10."""
    parts = re.split(r"(\d+)", config["name"].casefold())
    return tuple(int(part) if part.isdigit() else part for part in parts)


def add_configs(app_js: Path, json_files: list[Path], name_override: str | None) -> bool:
    existing = load_configs(app_js)
    existing_names = {config["name"] for config in existing}
    existing_ids = {config["id"] for config in existing}
    new_configs: list[dict[str, Any]] = []

    for index, json_file in enumerate(json_files):
        data = json.loads(json_file.read_text(encoding="utf-8-sig"))
        override = name_override if len(json_files) == 1 else None
        if name_override and len(json_files) > 1:
            print(f"Ignoring --name for {json_file}; --name is only used when adding one file.")
        config = normalize_config(data, override)
        if config["name"] in existing_names:
            print(f"Skipped duplicate config name: {config['name']}")
            continue
        make_unique_id(config, existing_ids)
        existing_names.add(config["name"])
        new_configs.append(config)

    if not new_configs:
        print("No new configs to add.")
        return False
    write_configs(app_js, existing + new_configs)
    print(f"Added {len(new_configs)} config(s) to {app_js}")
    return True


def list_configs(app_js: Path) -> None:
    configs = load_configs(app_js)
    if not configs:
        print("No built-in configs found.")
        return
    for index, config in enumerate(configs, start=1):
        sections = config["params"].get("sections", [])
        print(f"{index}. {config['name']}  id={config['id']}  sections={len(sections)}")


def delete_config(app_js: Path, target: str) -> bool:
    configs = load_configs(app_js)
    remaining = [config for config in configs if config["name"] != target and config["id"] != target]
    removed = len(configs) - len(remaining)
    if removed == 0:
        print(f"No config matched name or id: {target}")
        return False
    if not remaining:
        raise ValueError("Refusing to delete the last built-in config.")
    write_configs(app_js, remaining)
    print(f"Deleted {removed} config(s) from {app_js}")
    return True


def sort_configs(app_js: Path) -> bool:
    configs = load_configs(app_js)
    sorted_configs = sorted(configs, key=config_sort_key)
    if [config["id"] for config in configs] == [config["id"] for config in sorted_configs]:
        print("Configs are already sorted by name.")
        return False
    write_configs(app_js, sorted_configs)
    print(f"Sorted {len(sorted_configs)} config(s) by name in {app_js}")
    return True


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(
        add_help=False,
        description="Add, list, or delete built-in JSON configs in the static bellows generator.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    parser.add_argument("json_files", nargs="*", type=Path, help="JSON config file(s) to add")
    parser.add_argument("--app-js", type=Path, default=Path("app.js"), help="Path to app.js")
    parser.add_argument("-name", "--name", dest="name", help="Name to use for the added config; only valid with one JSON file")
    parser.add_argument("--list", action="store_true", help="List current built-in configs")
    parser.add_argument("--delete", metavar="NAME_OR_ID", help="Delete a built-in config by exact name or id")
    parser.add_argument("-sort", "--sort", action="store_true", help="Sort built-in configs by config name and print the sorted list")
    parser.add_argument("-h", "-help", "--help", action="help", help="Show this help message and exit")
    return parser


def main() -> None:
    parser = build_parser()
    args = parser.parse_args()

    if args.list and not args.sort:
        list_configs(args.app_js)
        return
    changed = False
    if args.delete:
        changed = delete_config(args.app_js, args.delete) or changed
    if args.json_files:
        if args.name and len(args.json_files) != 1:
            parser.error("-name/--name can only be used with exactly one JSON file")
        changed = add_configs(args.app_js, args.json_files, args.name) or changed
    elif not args.delete and not args.sort and not args.list:
        parser.error("provide JSON file(s), --list, --delete NAME_OR_ID, or -sort")
    if args.sort:
        changed = sort_configs(args.app_js) or changed
        list_configs(args.app_js)
    elif args.list:
        list_configs(args.app_js)


if __name__ == "__main__":
    main()
