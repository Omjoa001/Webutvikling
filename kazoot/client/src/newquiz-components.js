// @flow
import * as React from 'react';
import { Component } from 'react-simplified';
import { NavLink } from 'react-router-dom';
import { createHashHistory } from 'history';
import { Card, TileCard, Row, Button, Form, Column, Alert, NavBar } from './widgets';
import { quizService, questionService, categoryService } from './kazoot-service';
import {
  type QuizType,
  type CategoryType,
  type QuestionType,
  type AnswerType,
} from './kazoot-service';

const history = createHashHistory();

/*BRAINSTORMING*/
// All question props:
//     title: string = '';
//     questionText: string = '';
//     correct: string[] = [];
//     incorrect: string[] = [];
//     numCorrect: number = 0;
//     answers: AnswerType[] = [];

// Absolutely necessary:
//     questionText: string = '';
//     correct: string[] = [];
//     incorrect: string[] = [];

// database call per question needs:
// ans0, ans1, ans2, ans3
// ...

/**
 * Component which renders the New Quiz page.
 */
export class NewQuiz extends Component {
  constructor(props) {
    super(props);

    this.state = {
      questionText: '',
      answers: [],
    };
  }

  title: string = '';
  description: string = '';
  categoryId: number = 0;
  nextId: number = 0;

  questions: QuestionType[] = [];

  updated() {
    console.log(`updated: ${this.state.questionText}`);
    console.log(`updated: ${this.state.answers}`);
  }

  // questionText: string = '';
  // answers: AnswerType[] = [];

  mounted() {
    quizService.getNextId().then((next) => (this.nextId = next.AUTO_INCREMENT));
    // this.questionText = '';
    // this.answers = [];
  }

  sendData = (qtext, ans) => {
    this.setState({ questionText: qtext });
    this.setState({ answers: ans });
  };

  render() {
    return (
      <>
        <Card title="New Quiz!">
          <QuizInfoCard
            title={this.title}
            description={this.description}
            categoryId={this.categoryId}
            nextId={this.nextId}
          ></QuizInfoCard>
        </Card>

        <Card title="troubleshooting">
          <div>{this.state.questionText}</div>
          <div>{this.state.answers.answerText}</div>
        </Card>

        <Question
          parentCallback={(questionText, answers) => {
            this.sendData(questionText, answers);
          }}
        />
      </>
    );
  }
}

/**
 * Component to render information about the quiz being created in NewQuiz
 * TODO: Add database call for categories, etc.
 */
export class QuizInfoCard extends Component {
  title: string = '';
  description: string = '';
  categoryId: number = 0;
  nextId: number = 0;

  render() {
    return (
      <Card>
        <Row>
          <Column width={3}>Quiz-title:</Column>
          <Column>
            <Form.Input
              placeholder="Quiz title"
              type="text"
              value={this.props.title}
              onChange={(event) => (this.props.title = event.currentTarget.value)}
            ></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={3}>Quiz-Category:</Column>
          <Column>
            <select
              name="Category"
              value={this.props.categoryId}
              onChange={(event) => (this.props.categoryId = event.currentTarget.value)}
            >
              <option value="0">Velg en kategori</option>
              <option value="1">Matte</option>
              <option value="2">Fotball</option>
              <option value="3">Geografi</option>
              <option value="4">It</option>
              <option value="5">History</option>
            </select>
          </Column>
        </Row>
        <Row>
          <Column>Quiz-Id:</Column>
          <Column>
            <Form.Input value={this.props.nextId} disabled></Form.Input>
          </Column>
        </Row>
        <Row>
          <Column width={3}>Quiz-description:</Column>
          <Column>
            <Form.Textarea
              placeholder="Quiz description"
              type="text"
              value={this.props.description}
              onChange={(event) => (this.props.description = event.currentTarget.value)}
              row={10}
            ></Form.Textarea>
          </Column>
        </Row>
      </Card>
    );
  }
}

/**
 * Renders a single question
 */
export class Question extends Component {
  // These are defined properly in mounted
  title: string = '';
  questionText: string = '';
  answers: AnswerType[] = [];

  renderQuestionText() {
    return (
      <Form.Input
        placeholder="Question"
        value={this.questionText}
        onChange={(event) => {
          this.questionText = event.currentTarget.value;
        }}
      ></Form.Input>
    );
  }

  /**
   * Generates each answer with checkbox etc.
   * The output varies based on how many answers there are for
   * a given question:
   */
  renderAnswers() {
    let jsx: [] = [];

    let i = 0;
    this.answers.forEach((answer) => {
      jsx.push(
        <Row>
          <Column width={2}>
            <Form.Checkbox
              checked={answer.correct}
              onChange={(event) => {
                answer.correct = event.target.checked;
                console.log(`answer.correct set to ${answer.correct}`);
              }}
            ></Form.Checkbox>
          </Column>
          <Column>
            <Form.Input
              placeholder={`answer ${i}`}
              value={answer.answerText}
              onChange={(event) => {
                answer.answerText = event.currentTarget.value;
              }}
            ></Form.Input>
          </Column>
        </Row>
      );
      i++;
    });

    return jsx;
  }

  mounted() {
    this.title = 'New Question';
    this.questionText = '';
    this.answers = [
      { answerText: 'hei', correct: false },
      { answerText: 'på', correct: false },
      { answerText: 'deg', correct: false },
      { answerText: '!', correct: false },
    ];
  }

  handleOnClick() {
    // console.log(this.answers);
    this.props.parentCallback(this.questionText, this.answers);
  }

  /**
   * TODO: Add number of correct answers to the first column
   */
  render() {
    return (
      <>
        <Card title={this.title}>
          <Row>
            <Column width={2}>Correct: {}</Column>
            <Column> {this.renderQuestionText()} </Column>
          </Row>
          {this.renderAnswers()}
        </Card>
        <Button.Success onClick={this.handleOnClick}>hei</Button.Success>
      </>
    );
  }
}
