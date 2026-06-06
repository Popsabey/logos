import os
import re

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        return

    new_content = content
    # Handle the specific crate name first
    new_content = new_content.replace("rhema_lib", "logos_lib")
    new_content = new_content.replace("Rhema", "Logos")
    new_content = new_content.replace("RHEMA", "LOGOS")
    new_content = new_content.replace("rhema", "logos")

    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

def main():
    skip_dirs = {'.git', 'node_modules', 'target', 'dist'}
    valid_exts = {'.ts', '.tsx', '.js', '.jsx', '.json', '.toml', '.rs', '.md', '.yml', '.yaml', '.html'}
    
    for root, dirs, files in os.walk('.'):
        dirs[:] = [d for d in dirs if d not in skip_dirs]
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in valid_exts:
                replace_in_file(os.path.join(root, file))

if __name__ == "__main__":
    main()
