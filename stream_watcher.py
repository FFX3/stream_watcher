from python_script.check_link import check_links
import time
import datetime
from dotenv import load_dotenv
import os
from supabase import create_client, Client

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")

supabase: Client = create_client(url, key)

while True:
    try:
        response = supabase.table('private_cameras').select("access_link").limit(20).order("stream_last_checked", desc=False).execute()
        print(response)

        rows = response.data
        links = []
        for row in rows:
            links.append(row['access_link'])

        print(links)
        supabase.table('private_cameras').update({"stream_last_checked": datetime.datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}).in_('access_link', links).execute()

        results = check_links(links)

        offline_cameras = []
        online_cameras = []

        for (url, result) in results.items():
            if result:
                online_cameras.append(url)
            else:
                offline_cameras.append(url)

        supabase.table("private_cameras").update({"online": True }).in_('access_link', online_cameras).execute()
        supabase.table("private_cameras").update({"online": False }).in_('access_link', offline_cameras).execute()

        print(results)
    except:
        print('crashed')
