import { Quiz, Card } from "/misc/quiz.mjs";


/**
 * Expects HTML elements with ids
 * - question: p
 * - answer-list: div
 * - answer-{a-d}: button
 * @returns {Quiz}
 */
export function barQuiz() {
  return new Quiz(
    'file-path',
    /** @param {title:string,description:string} caseLaw */ (caseLaw)=> {
      if (!caseLaw.title) return null
      if (!caseLaw.description) return null

      return new Card(
        caseLaw.title,
        caseLaw.description
      )
    }
  )
}
