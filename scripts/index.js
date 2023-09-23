const testTitleInput = document.querySelector('#title')
const questionInput = document.querySelector('#question')
const answerOneInput = document.querySelector('#answer-one')
const answerTwoInput = document.querySelector('#answer-two')
const answerThreeInput = document.querySelector('#answer-three')
const answerFourInput = document.querySelector('#answer-four')
const submitBtn = document.querySelector('#submit-btn')
const testRenderArea = document.querySelector('#test-render-area')
const addTitleBtn = document.querySelector('#add-title-btn')

const addTitle = e => {
    e.preventDefault()

    const test = JSON.parse(localStorage.getItem('test'))

    test.title = testTitleInput.value

    localStorage.setItem('test', JSON.stringify(test))

    testTitleInput.value = ''

    renderTest()
}

const createTestQuestion = e => {
    e.preventDefault()

    const test = JSON.parse(localStorage.getItem('test'))

    const hasLength = test.questions.length > 0 ? true : false

    const testQuestion = {
        id: hasLength ? test.questions[test.questions.length - 1].id + 1 : 1,
        text: questionInput.value,
        answers: [
            {
                content: answerOneInput.value,
                isCorrect: true
            },
            {
                content: answerTwoInput.value,
                isCorrect: false
            },
            {
                content: answerThreeInput.value,
                isCorrect: false
            },
            {
                content: answerFourInput.value,
                isCorrect: false
            }
        ]
    }

    test.questions.push(testQuestion)
    localStorage.setItem('test', JSON.stringify(test))

    renderTest()

    questionInput.value = ''
    answerOneInput.value = ''
    answerTwoInput.value = ''
    answerThreeInput.value = ''
    answerFourInput.value = ''
}

const renderTest = () => {
    if (!localStorage.getItem('test')) {
        const test = {
            title: '',
            questions: []
        }

        localStorage.setItem('test', JSON.stringify(test))
    }

    const storedTest = JSON.parse(localStorage.getItem('test'))

    let output = ''

    if (storedTest.title === '') {
        output += `
            <h2>No title yet.</h2>
        `
    } else {
        output += `
            <div>
                <span>${storedTest.title}</span>
                <button class="delete-btn" id="delete-title-btn" type="button">Delete</button>
            </div>
        `
    }

    if (storedTest.questions.length === 0) {
        output += `
            <p>
                <small>No questions yet.</small>
            </p>
        `
    } else {
        storedTest.questions.forEach(question => {
            output += `
                <div>
                    <p>${question.id}. ${question.text}</p>
                    <ol type="a">
                        <li>${question.answers[0].content}</li>
                        <li>${question.answers[1].content}</li>
                        <li>${question.answers[2].content}</li>
                        <li>${question.answers[3].content}</li>
                    </ol>
                    <button type="button" class="delete-btn btn" data-questionid=${question.id}>Delete</button>
                </div>
            `
        })
    }

    output += `
        <div>
            <button type="button" id="print-btn" class="btn">Print Test</button>
        </div>
    `

    testRenderArea.innerHTML = output

    if (document.querySelector('#delete-title-btn') !== null) {
        document.querySelector('#delete-title-btn').addEventListener('click', deleteTitle)
    }

    document.querySelectorAll('.delete-btn').forEach(node => node.addEventListener('click', deleteQuestion))
    document.querySelector('#print-btn').addEventListener('click', printTest)
}

const deleteQuestion = e => {
    e.preventDefault()
    const test = JSON.parse(localStorage.getItem('test'))
    test.questions = test.questions.filter(question => question.id !== Number(e.target.getAttribute('data-questionid')))
    localStorage.setItem('test', JSON.stringify(test))
    renderTest()
}

const deleteTitle = e => {
    e.preventDefault()
    const test = JSON.parse(localStorage.getItem('test'))
    test.title = ''
    localStorage.setItem('test', JSON.stringify(test))
    renderTest()
}

const printTest = () => {
    let output = ``

    const storedTest = JSON.parse(localStorage.getItem('test'))
  
    if (storedTest.questions.length === 0) {
      alert('Please create a test to print')
    } else {
      output += `
        <div style="margin: 2rem 0 5rem 0; font-family: sans-serif; font-size: 32px;">
          <h2 style="text-align: center;">${storedTest.title}</h2>
        </div>
      `
  
      storedTest.questions.forEach(question => {
        output += `
            <div>
                <p>${question.id}. ${question.text}</p>
                <ol type="a">
                    <li>${question.answers[0]}</li>
                    <li>${question.answers[1]}</li>
                    <li>${question.answers[2]}</li>
                    <li>${question.answers[3]}</li>
                </ol>
                <button type="button" class="delete-btn btn" data-questionid=${question.id}>Delete</button>
            </div>
        `
      })
  
      let printWin = window.open('')
      printWin.document.write(output)
      printWin.print()
      printWin.stop()
    }
  }

renderTest()

addTitleBtn.addEventListener('click', addTitle)
submitBtn.addEventListener('click', createTestQuestion)