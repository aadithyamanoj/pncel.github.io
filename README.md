# PNCEL's Group Website

## For Group Members

If you wish to add personalized contents to your own page, check `public/database/persons.yaml` for your member ID, or check the last part of your person page's URL.
Once you have the member ID, create an [MDX](https://mdxjs.com/) (Markdown w/ embedded JSX) file under `src/app/team/\[memberId\]` with your member ID (i.e., `[memberId].mdx`).
Edit the file as you wish, then create a PR/branch and ask Ang to merge it into the main branch.

The website also supports links to your other personal pages, including: your own website, Google Scholar, OrcID, GitHub, LinkedIn, X (formerly Twitter), Facebook, Instagram, Youtube. In addition, a short statement can be shown at the team page.

Once we have more publications (or you're welcome to add your pre-UW publications, too!), there is also support to add publications to your own page. Project cards, blogs, news are also planned and will be added some time in the future.

## Directly Editting Database

With the new YAML-based database files (`public/database/*.yaml`), it's now easier to make changes to the website. You can directly add new entries into any databases but you have to follow the rules below:

1. IDs are required. You can either find a non-existing ID of your choice, or use temporary IDs starting with a `"."`, e.g. `".1"`, `".person-01"`, `".pub-a"`. This is required. It is OK to reference temporary IDs in cross-reference fields, e.g.
   `pub.authorIds` can include temporary IDs assigned to newly created entries in `persons.yaml`.
2. Make sure your new entries meet the schema requirements. See [cheatsheet below](#database-editting-cheatsheet). Detailed schemas can be found in `src/data/types.ts`.
3. You may ignore the `_meta` and `_deleted` fields.
4. After saving your changes, run `npm run db fix` at repo root. This should assign permanent IDs to your created entries and fill in the rest information. If there's any error, it also prints a long error message, and you may be able to find what's wrong by looking carefully into it -- PR welcomed to process that message!

#### Database Editting Cheatsheet

```YAML
persons.yaml:
  id: REQUIRED, string
  firstname: REQUIRED, string
  lastname: REQUIRED, string
  middlename: optional, string
  goby: optional, string
  avatar: optional, string. Path to a file under `public` (omitting `public`)
  externalLink: optional, string. URL to external personal website
  memberInfo:
    $comment: memberInfo is optional in person. Add this to indicate the person being added is a PNCEL member.
    role: REQUIRED, must be one of: other, pi, phd, ms, ug, postdoc, staff, visitor
    whenJoined: REQUIRED, date in format "2020-01-01"
    whenLeft: optional
    position: optional, string
    email: optional, string
    office: optional, string
    links:
      - $comment: links is optional in memberInfo. This is an array of objects
        link: REQUIRED, string
        label: optional, string
        icon: optional, must be one of: link, pdf, video, github, website, gscholar, orcid, linkedin, instagram, facebook, youtube, chip, medal
    selectedPubs:
      - $comment: selectedPubs is optional in memberInfo. This is an array of strings (Publication IDs)

pubs.yaml:
  id: REQUIRED, string
  title: REQUIRED, string
  time: REQUIRED, date in format "2020-01-01"
  authorIds:
    - $comment: authorIds is REQUIRED in publication. This is an array of strings (Person IDs)
  booktitle: optional, string
  doi: optional, string. Only the 10.xxxxxx/xxxxxxxx part (omitting https://doi.org/)
  bibtex: optional, string
  arxivDoi: optional, string
  arxivBibtex: optional, string
  authorsCopy: optional, string. Path to a file under `public` (omitting `public`), or a URL
  equalContrib: optional, integer. Indicating the first N authors contributed equally to the paper. I.e., co-first-author.
  notPncel: optional, boolean. Indicating the work is done while no author is affiliated with PNCEL. This has no effect on the website now.
  tags:
    - $comment: tags is optional in publication. This is an array of objects
      label: REQUIRED, string
      type: REQUIRED, must be one of: other, award, venue, tapeout
      icon: optional, must be one of: link, pdf, video, github, website, gscholar, orcid, linkedin, instagram, facebook, youtube, chip, medal
      link: optional, string
  attachments:
    - $comment: attachments is optional in publication. This is an array of objects
      label: REQUIRED, string
      link: REQUIRED, string. Can be a path to a file under `public` or a URL
      icon: optional, must be one of: link, pdf, video, github, website, gscholar, orcid, linkedin, instagram, facebook, youtube, chip, medal

photos.yaml: Not recommended for direct modification. Use `npm run db add-photo` instead
```

## Tech Stack

- Main framework: [Next.js](https://nextjs.org)
- Database: [RxDB](https://rxdb.info/) with [YAML](https://yaml.org/)
- CSS: [TailwindCSS](https://tailwindcss.com/)
- UI: [DaisyUI](https://daisyui.com/)

# For developers

## Installation

```bash
# install nvm
#   from scratch & locally:
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
# follow prompt to restart terminal or source NVM into your path

# install dependencies
nvm install stable
nvm use stable
npm install -D .   # in this repo's root directory
```

## Enter dev environment

```bash
# w/ NVM (NodeJS Version Management)
nvm use stable
```

## **BEFORE COMMIT**

```bash
npm run lint
# fix any reported errors

npm run format
```

## **CLI TOOLS**

#### New blog

```bash
npm run blog "Your title here"
# creates /src/app/blogs/[blogId]/your-title-here-YYYY-MM-DD.mdx if the file does not already exists
```

#### Add publication from DOI

```bash
npm run db add-doi <doi> [<doi> ...]
# then follow the interactive command lines for more
```

#### Update all publications' bibtex from DOI

```bash
npm run db update-bibtex
```

#### Add a photo

```bash
npm run db add-photo --date 2024-01-01 --title "Hello, world!" --subtitle "Bye, world!" ~/my_photo.jpg
```

## Dev tools

#### Live server

```bash
npm run dev
# then visit http://localhost:3000 (or another port according to the command line output)
```
