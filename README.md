# hitsbyhali
Blog for music documentation. Writing about thoughts and experiences with making music and sharing it.


# deploying changes

Push your changes to the `main` branch and the site will update automatically:

```bash
git add .
git commit -m "your message here"
git push
```

GitHub Actions picks up the push, builds the site with Hugo, and deploys it to GitHub Pages. You can watch the progress under the **Actions** tab in the GitHub repo — it usually takes a minute or two.

No manual build step needed.

---

# adding to the site:

- to make a new blog/poem/music post,

## adding a new blog post
```
hugo new content/posts/your-post-slug/index.md
```

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

## music video cards

The "Links to my MUSIC!" section on the home page shows thumbnail cards that link to YouTube music videos. By default it automatically displays the **3 most recent** music pages (sorted by date).

To pin specific songs instead, add a `featured_songs` list to `content/_index.md`:

```yaml
featured_songs:
  - "Run Out Of Time"
  - "The Person I Became"
  - "Back To You - Work in progress"
```

The titles must match exactly. When `featured_songs` is present it overrides the auto-latest-3 behavior. Remove the list to go back to automatic.

### adding a new music page

```
hugo new content/music/your-song-slug.md
```

Open the new file and add `youtube_id` to the front matter — this is what powers the thumbnail and the link:

```toml
+++
date = '2026-06-12T00:00:00-04:00'
draft = false
title = 'Your Song Title'
youtube_id = 'xxxxxxxxxxx'   ← the ID from the YouTube URL (youtube.com/watch?v=THIS_PART)
+++
```

Once `youtube_id` is set, the card will appear automatically (it becomes one of the latest 3, or you can add it to `featured_songs`).

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
