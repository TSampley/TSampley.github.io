
// MARK: Facade

export class Quiz {
  constructor(
    sourceUrl,
    mapper
  ) {
    this.sourceUrl = sourceUrl
    this.mapper = mapper

    this.ui = new QuizUi(
      'question',
      'answer-list',
      'answer-a',
      'answer-b',
      'answer-c',
      'answer-d'
    );
    this.model = new QuizModel();
    this.presenter = new QuizPresenter(this.model);
  }
  static CHOICE_COUNT = 4;

  /**
   * Fetches a file from {sourceFile} and applies the given {mapper} to each
   * element; if the data is an array, the mapper is applied to each element; if the data is an object, the mapper is applied to each value of the object. The result is always an array of the mapped values.
   * 
   * @template I input type
   * @template O output type
   * @param {string} sourceFile The file URL string to fetch.
   * @param {(element:I)=>O} mapper The mapper function to call on each object in the list
   * retrieved from the given {sourceFile}.
   * @returns {Promise<O[]>}
   */
  async load(sourceFile, mapper) {
    console.info(`Quiz.load(${sourceFile},${mapper})`)
    const response = await fetch(sourceFile);
    const data = await response.json();
    const result = [];
    if (Array.isArray(data)) {
      data.forEach((element)=> {
        const mapped = mapper(element)
        if (mapped) result.push(mapped)
      })
    } else {
      for (const key in data) {
        const mapped = mapper(data[key])
        if (mapped) result.push(mapped)
      }
    }
    return result;
  }

  /**
   * Populates the quiz with questions from a file.
   * @param {string} sourceFile The file URL string to fetch.
   * @param {(element:*)=>Card} mapper The mapper function to call on each object in the list
   * retrieved from the given {sourceFile}. The mapper should return a Card object for each element.
   * @returns {Promise<void>}
   */
  async populate(sourceFile, mapper) {
    console.info(`Quiz.populate(${sourceFile},${mapper})`)
    const cards = await this.load(sourceFile, mapper);
    this.presenter.onQuizData(cards)
  }

  /**
   * Starts the quiz. This method should be called after the quiz has been populated with cards.
   * 
   * TODO: refactor to preferred approach
   *   1. UI collects and/or creates HTML elements in constructor
   *   2. define __Ui.bindEventsToIntents(Intent)
   *   3. define __Presenter.bindViewToModel
   *   4. define __Model.#state function and object
   */
  async start() {
    console.info(`Quiz.start()`)

    this.presenter.bindViewToModel()
    await this.populate(this.sourceUrl,this.mapper)

    // TODO: update the model and presenter to start the quiz and update the UI accordingly.
    this.presenter.model.reset();
    this.presenter.onStart();
  }
}

// MARK: UI
export class QuizUi {
  /**
   * 
   * @param {string} questionId 
   * @param {string} answerListId 
   * @param {string} answerAId 
   * @param {string} answerBId 
   * @param {string} answerCId 
   * @param {string} answerDId 
   */
  constructor(
    questionId,
    answerListId,
    answerAId,answerBId,answerCId,answerDId
  ) {
    this.questionElement = document.getElementById(questionId);
    this.answerListElement = document.getElementById(answerListId);
    this.answerElements = [
      document.getElementById(answerAId),
      document.getElementById(answerBId),
      document.getElementById(answerCId),
      document.getElementById(answerDId)
    ];
  }

  /**
   * 
   * @param {(choice:number)=>void} onSelectChoice 
   */
  bindEventsToIntents(onSelectChoice) {
    this.answerElements[0].addEventListener('click', () => {
      onSelectChoice(0);
    })
    this.answerElements[1].addEventListener('click', () => {
      onSelectChoice(1);
    })
    this.answerElements[2].addEventListener('click', () => {
      onSelectChoice(2);
    })
    this.answerElements[3].addEventListener('click', () => {
      onSelectChoice(3);
    })
  }

  /**
   * 
   * @param {ModelState} state 
   */
  setState(state) {
    console.info(`QuizUi.setState(${state})`)
    this.setQuestion(state.currentQuestion)
  }

  /**
   * 
   * @param {Question} question The model to bind to the UI.
   */
  setQuestion(question) {
    if (!question) {
      this.questionElement.textContent = 'Invalid Question';
      this.answerElements.forEach((element) => {
        element.textContent = 'No Answer';
      });
      return;
    }
    if (question instanceof Question) {
      this.questionElement.textContent = question.prompt;
      for (let i = 0; i < Quiz.CHOICE_COUNT; i++) {
        let text = question.choiceList[i];
        if (text.trim().length == 0) {
          text = "No Answer Text"
        }
        this.answerElements[i].textContent = text
      }
    } else {
      console.info('Expected a Question object, but got: ', question);
    }
  }
}

// MARK: Presenter
/**
 * Passes UI events to the model and updates the UI with any changes to the 
 * model.
 */
export class QuizPresenter {
  /**
   * 
   * @param {QuizModel} model 
   * @param {QuizUi} ui
   */
  constructor(model,ui) {
    this.model = model
    this.ui = ui
  }

  onStart() {
    // manipulate the model
    this.model.reset();
    this.model.pullCard();
  }

  onSelectA() {
    this.#onSelect(0);
  }

  onSelectB() {
    this.#onSelect(1);
  }
  
  onSelectC() {
    this.#onSelect(2);
  }

  onSelectD() {
    this.#onSelect(3);
  }

  #onSelect(choice) {
    // manipulate the model
    this.model.respond(choice);
    this.model.pullCard();
  }
    
  /**
   * 
   * @param {Card[]} cards 
   */
  onQuizData(cards) {
    this.model.cards = cards
    this.model.reset()
  }

  /**
   * 
   */
  bindViewToModel() {
    console.info('Quiz.bind()')
    // causes the UI to retrieve document elements and bind event listeners to the presenter methods
    this.ui.bindEventsToIntents(
      (choice)=>{
        switch (choice) {
          case 0:
            this.onSelectA()
            break;
          case 1:
            this.onSelectB()
            break;
          case 2:
            this.onSelectC()
            break;
          case 3:
            this.onSelectD()
            break;
          default:
            throw `Unexpected case ${choice}`
        }
      });
    // update the UI with the current model state
    this.ui.setQuestion(this.model.currentQuestion);

    // bindChangesToUpdates
    const capturedUi = this.ui
    this.model.addEventListener('state', ({/** @type {ModelState} */ detail })=> {
      console.info(`onState: `, detail)
      capturedUi.setState(detail)
    })
  }
}

// MARK: Interactors

/**
 * 
 * @param {Card[]} cards
 * @returns {Question[]}
 */
function generateQuestionAnswers(cards) {
  // Start with 4 random card from the list of cards.
  // Select a random card to be the correct answer.
  // Generate a Question with the prompt and answer from the pulled card,
  //   and 3 random answers from the remaining cards.
  // Remove the pulled card from the choices and add a new random card
  //   from the remaining cards.
  // Repeat until there are no more extra cards to add, then repeat the process with the previously generated questions until there are no more questions to generate.
  // 

  const candidates = cards.slice().sort(() => Math.random() - 0.5);
  const choices = [];
  for (let i = 0; i < Quiz.CHOICE_COUNT; i++) {
    choices.push(candidates.pop());
  }

  const questionAnswers = [];
  const generated = [];

  while (candidates.length > 0) {
    // shuffle the choices
    choices.sort(() => Math.random() - 0.5);
    // select a random index for the correct answer
    const correctIndex = Math.floor(Math.random() * Quiz.CHOICE_COUNT);
    const selected = choices[correctIndex];
    const answers = choices.map((card) => card.answer);
    questionAnswers.push(new Question(
      selected.prompt,
      answers,
      correctIndex
    ));
    // add the selected card to the list of generated questions
    generated.push(selected);
    // remove the correct answer
    choices.splice(correctIndex, 1);
    // add a new random choice
    choices.push(candidates.pop());
  }

  // don't shuffle these last questions
  for (let i = 0; i < Quiz.CHOICE_COUNT; i++) {
    // select the correct answer from the remaining choices
    const correctIndex = Quiz.CHOICE_COUNT - 1 - i;
    const selected = choices[correctIndex];
    const answers = choices.map((card) => {
      if (card) return card.answer; else throw `Invalid card: ${card}`;
    });
    questionAnswers.push(new Question(
      selected.prompt,
      answers,
      correctIndex
    ));
    // remove the correct answer
    choices.splice(correctIndex, 1);
    // add a new random choice from previously generated questions
    choices.push(generated.pop());
  }

  return questionAnswers;
}

// MARK: Model

/**
 * Represents a simple, associative relationship between two pieces of data.
 */
export class Card {
  /**
   * 
   * @param {string} prompt Text prompt
   * @param {string} answer Text answer
   */
  constructor(prompt,answer) {
    this.prompt = prompt;
    this.answer = answer;
  }
}

/**
 * Represents a 
 */
class Question {
  /**
   * 
   * @param {string} prompt The text expressing the question.
   * @param {string[]} choiceList An array of options to choose from.
   * @param {number} answer The index of the choice within the given {choiceList}.
   */
  constructor(prompt,choiceList,answer) {
    this.prompt = prompt;
    this.choiceList = choiceList;
    this.answer = answer;
  }
}

/**
 * A student response to a Question.
 */
class Response {
  /**
   * 
   * @param {Question} question 
   * @param {number} choice 
   */
  constructor(question,choice) {
    this.question = question;
    this.choice = choice;
  }
}

class ModelState {
  constructor(correct,incorrect,remaining,currentQuestion) {
    this.correct = correct
    this.incorrect = incorrect
    this.remaining = remaining
    this.currentQuestion = currentQuestion
  }
}

/**
 * Encapsulates the business logic of the quiz.
 */
export class QuizModel extends EventTarget {

  /**
   * 
   * @param {Card[]} cards 
   */
  constructor(cards) {
    super()
    this.cards = cards || [];

    this.correctCount = 0;
    this.incorrectCount = 0;
    this.totalAnswered = 0;

    /** @type {Question[]} */
    this.unaskedQuestions = [];
    this.currentQuestion = null;
    this.answers = {};
  }

  #modelState() {
    return new ModelState(
      this.correctCount,
      this.incorrectCount,
      this.unaskedQuestions.length,
      this.currentQuestion
    )
  }

  #broadcastState() {
    this.dispatchEvent(new CustomEvent('state', { detail: this.#modelState() }))
  }

  reset() {
    this.correctCount = 0;
    this.incorrectCount = 0;
    this.totalAnswered = 0;

    this.unaskedQuestions = generateQuestionAnswers(this.cards);
    this.currentQuestion = null;
    this.answers = {};

    this.#broadcastState()
  }

  /**
   * Respond to the current question with the given {choice}.
   * 
   * @param {number} choice Index of the response selected.
   */
  respond(choice) {
    if (!this.currentQuestion) {
      console.warn('No Current Question')
      return
    }

    if (this.answers.length > 0) {
      if (this.currentQuestion in this.answers) {
        const lastAnswer = this.answers[this.currentQuestion];

        if (lastAnswer.choice === this.currentQuestion.answer) {
          this.correctCount--;
        } else {
          this.incorrectCount--;
        }
      }
      if (lastAnswer.question == this.currentQuestion) {
        // replace the last answer with the new answer
      } else {
        // add the new answer to the list of answers
      }
    }    
    this.answers[this.currentQuestion] = choice;
    if (choice === this.currentQuestion.answer) {
      this.correctCount++;
    } else {
      this.incorrectCount++;
    }
    this.totalAnswered++;

    this.#broadcastState()
  }

  /**
   * @returns {Question} the next question card to be asked
   */
  pullCard() {
    this.currentQuestion = this.unaskedQuestions.pop();

    this.#broadcastState()
  }
}
