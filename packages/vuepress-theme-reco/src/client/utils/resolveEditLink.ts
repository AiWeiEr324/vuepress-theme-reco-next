import {
  isLinkHttp,
  removeLeadingSlash,
  removeEndingSlash,
} from '@vuepress/shared'
import { resolveRepoType } from './resolveRepoType'
import type { RepoType } from './resolveRepoType'

export const editLinkPatterns: Record<Exclude<RepoType, null>, string> = {
  GitHub: ':repo/edit/:branch/:path',
  GitLab: ':repo/-/edit/:branch/:path',
  Gitee: ':repo/edit/:branch/:path',
  Bitbucket:
    ':repo/src/:branch/:path?mode=edit&spa=0&at=:branch&fileviewer=file-view-default',
}

export const resolveEditLink = ({
  docsRepo,
  docsBranch,
  docsDir,
  path,
  editLinkPattern,
}: {
  docsRepo: string
  docsBranch: string
  docsDir: string
  path: null | string
  editLinkPattern?: string
}): string | null => {
  const repoType = resolveRepoType(docsRepo)

  let pattern: string | undefined

  if (editLinkPattern) {
    pattern = editLinkPattern
  } else if (repoType !== null) {
    pattern = editLinkPatterns[repoType]
  }

  if (!pattern) return null

  const filePathRelative = path.replace(/\.html$/, '.md')

  return pattern
    .replace(
      /:repo/,
      isLinkHttp(docsRepo) ? docsRepo : `https://github.com/${docsRepo}`
    )
    .replace(/:branch/, docsBranch)
    .replace(
      /:path/,
      removeLeadingSlash(`${removeEndingSlash(docsDir)}/${filePathRelative}`)
    )
}
