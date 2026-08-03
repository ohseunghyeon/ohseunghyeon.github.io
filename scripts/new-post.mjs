#!/usr/bin/env node
/**
 * 새 글의 껍데기를 만든다. `npm run post`로 실행한다.
 *
 * 원본 cli/create-new-post.js를 ESM으로 옮긴 것이다. inquirer 7은
 * CommonJS였고 현행 버전은 ESM이라 @inquirer/prompts로 교체했다.
 * 동작(카테고리 선택, 신규 카테고리 입력, 파일/디렉터리 선택,
 * report의 추가 필드)은 그대로 유지한다.
 */
import { mkdir, writeFile, readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { select, input } from '@inquirer/prompts'
import matter from 'gray-matter'

const TARGET_DIR = 'src/content/blog'
// 이 카테고리는 하위 카테고리를 가진다
const SUB_CATEGORY_LIST = ['algorithm']
const CREATE_NEW = '[[ CREATE NEW CATEGORY ]]'

async function findCategories() {
  const result = []

  for (const item of await readdir(TARGET_DIR, { withFileTypes: true })) {
    if (!item.isDirectory()) continue

    if (SUB_CATEGORY_LIST.includes(item.name)) {
      const subs = await readdir(join(TARGET_DIR, item.name), { withFileTypes: true })
      for (const sub of subs) {
        if (sub.isDirectory()) result.push(`${item.name}/${sub.name}`)
      }
    } else {
      result.push(item.name)
    }
  }

  return result.sort()
}

const categories = await findCategories()

let category = await select({
  message: 'Select a category',
  choices: [...categories.map(c => ({ value: c })), { value: CREATE_NEW }],
})

if (category === CREATE_NEW) {
  category = await input({ message: 'Enter the customized category' })
}
if (!category) throw new Error('Cannot find category!')

const title = await input({ message: 'Enter the title', default: 'New post title' })

const headers = {
  title,
  date: new Date().toISOString(),
  description: '',
  category,
}
if (category === 'report') {
  headers.creator = ''
  headers.created_at = ''
  headers.link = ''
}

const type = await select({
  message: 'Select the way to make file',
  choices: [{ value: 'file' }, { value: 'directory' }],
})

const slug = title.split(' ').join('-').toLowerCase()
const destDir = join(TARGET_DIR, category, type === 'directory' ? slug : '')
const fileName = `${type === 'directory' ? 'index' : slug}.md`
const filePath = join(destDir, fileName)

await mkdir(destDir, { recursive: true })
// 원본과 동일하게 작은따옴표를 제거한다 (프론트매터 인용 부호 정리)
await writeFile(filePath, matter.stringify('', headers).split("'").join(''))

console.log('\nSuccess to create new post!')
console.log(filePath)
