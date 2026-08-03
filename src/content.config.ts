import { defineCollection, z } from 'astro:content'
import { glob } from 'astro/loaders'

/**
 * created_at 은 원본 데이터의 형식이 뒤죽박죽이다.
 * `2021. 3. 31.`, `2019.10.24`, `2020-09-01`, 심지어 `goldfiglabs`(오기입)까지 섞여 있다.
 * YAML이 ISO 형태 3건만 Date로 파싱하므로 타입이 string과 Date로 갈린다.
 *
 * Gatsby는 이 필드를 String으로 추론했고, Date로 파싱된 값은 toISOString() 결과가
 * 그대로 출력됐다 (라이브 사이트에서 `2017-02-22T00:00:00.000Z` 확인).
 * 그 동작을 그대로 재현해 소비자에게는 항상 string을 넘긴다.
 */
const looseDateString = z.union([
  z.string(),
  z.date().transform(d => d.toISOString()),
])

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    // 89건은 YAML이 Date로, 24건은 인용부호 때문에 string으로 파싱한다
    date: z.coerce.date(),
    category: z.string(),
    // 100건은 string, 12건은 `description:` 빈 값이라 null로 파싱된다
    description: z.string().nullish(),
    // 이하 report 카테고리 전용
    creator: z.string().nullish(),
    created_at: looseDateString.nullish(),
    link: z.string().nullish(),
    todo: z.boolean().optional(),
  }),
})

export const collections = { blog }
