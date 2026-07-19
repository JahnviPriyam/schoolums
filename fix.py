import os
search_dir = r"c:\Users\jahnv\Desktop\schoolums\frontend\src"
for root, _, files in os.walk(search_dir):
    for file in files:
        if file.endswith(('.tsx', '.ts')):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Fix double replacements
            new_content = content.replace('${import.meta.env.VITE_API_URL || `${import.meta.env.VITE_API_URL || "http://localhost:9000"}`}', '${import.meta.env.VITE_API_URL || "http://localhost:9000"}')
            new_content = new_content.replace('import.meta.env.VITE_API_URL || import.meta.env.VITE_API_URL || "http://localhost:9000"', 'import.meta.env.VITE_API_URL || "http://localhost:9000"')
            
            if content != new_content:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(new_content)
                print(f"Fixed {filepath}")
