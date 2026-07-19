import urllib.request
import re

try:
    # Get index.html
    req = urllib.request.Request('http://16.171.34.143:8080/')
    res = urllib.request.urlopen(req)
    html = res.read().decode('utf-8')
    
    # Extract the JS file URL
    js_file = re.search(r'src=\"(/assets/index-[^\"]+\.js)\"', html)
    if js_file:
        js_url = 'http://16.171.34.143:8080' + js_file.group(1)
        print('Found JS file:', js_url)
        
        # Get JS file
        js_res = urllib.request.urlopen(js_url)
        js_code = js_res.read().decode('utf-8')
        
        # Search for localhost or 16.171
        print('Contains localhost:9000?', 'localhost:9000' in js_code)
        print('Contains 16.171.34.143?', '16.171.34.143' in js_code)
        
        # Print a snippet around localhost
        if 'localhost:9000' in js_code:
            idx = js_code.find('localhost:9000')
            print(js_code[max(0, idx-50):idx+50])
            
        if '16.171.34.143' in js_code:
            idx = js_code.find('16.171.34.143')
            print(js_code[max(0, idx-50):idx+50])
            
except Exception as e:
    print('ERROR:', e)
