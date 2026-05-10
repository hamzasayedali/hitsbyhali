# hitsbyhali
Blog for music documentation. Writing about thoughts and experiences with making music and sharing it.


# adding to the site:

- to make a new blog/poem/music post,

## adding a gallery photo

Create a new folder inside `content/gallery/` with the photo's slug as the folder name. Put two things in it: an `index.md` and the image file.

```
content/gallery/
  my-photo-name/
    index.md
    photo.jpg      ← any .jpg, .png, or .webp works
```

The `index.md` should look like this:

```toml
+++
title = "Golden Hour at the Park"
place = "Brooklyn, NY"
date = 2025-04-20
draft = false
description = "It was late April and the light was doing something I hadn't seen before..."
+++
```

- `title` — shown on the gallery grid card and the detail page
- `place` — city, venue, wherever the photo was taken
- `date` — controls the display date; also used for ordering
- `description` — the paragraph that shows up when someone clicks through to the photo
- `draft = true` hides the photo from the live site until you're ready

The image file just needs to live in the same folder as `index.md` — the name doesn't matter. Hugo will generate the square thumbnail for the grid automatically.


# customizing the home page

The home page is controlled by one file: `content/_index.md`

Open that file and edit the front matter at the top (between the `---` lines).

## social links

```yaml
social_links:
  - name: Instagram
    url: https://instagram.com/yourhandle
  - name: Twitter / X
    url: https://x.com/yourhandle
```

Add, remove, or reorder entries as needed. The `name` is the button label.

## streaming links

```yaml
streaming_links:
  - name: Spotify
    url: https://open.spotify.com/artist/yourartistid
  - name: Apple Music
    url: https://music.apple.com/yourpage
```

Same format as social links.

## upcoming shows

```yaml
shows:
  - date: "June 1, 2026"
    venue: The Venue Name
    location: New York, NY
    ticket_url: https://tickets.example.com
```

- `ticket_url` is optional — leave it as `""` or remove the line entirely if there's no ticket link yet.
- To remove a show, delete its block (the `- date:` line and everything indented under it).
- Shows display in the order you list them, so put the soonest one first.
