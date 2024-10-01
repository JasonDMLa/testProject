import Phaser from "phaser";
import { getAllHistoryQuestions } from "../data/historyQuestions.js"; // Ensure you import this correctly

const HistoryScene = (setCurrentScene, setHistoryCompleted) => {
  return {
    preload: function () {
      // Preload assets like background image
      this.load.image("background", "../../public/backgrounds/pokeman.jpg"); // Change the path accordingly
    },

    create: function () {
      // Initialize variables
      let currentQuestionIndex = 0;
      let score = 0;
      let wrongAnswer = 0;
      let correctAnswer = "";
      const allHistoryQuestions = []; // Use a local variable

      // Display the score and wrong answer counters
      const scoreText = this.add.text(16, 16, `Score: ${score}`, {
        fontSize: "32px",
        fill: "#fff",
      });

      const wrongText = this.add.text(16, 80, `Wrong: ${wrongAnswer}`, {
        fontSize: "32px",
        fill: "#fff",
      });

      // Question text display
      const questionText = this.add.text(100, 200, "", {
        fontSize: "28px",
        fill: "#fff",
        wordWrap: { width: 600 }, // Wrap text to fit within the game window
      });

      // Create answer buttons and store them in an array
      const answerButtons = [];
      for (let i = 0; i < 4; i++) {
        const button = this.add
          .text(150, 300 + i * 50, "", {
            fontSize: "24px",
            fill: "#fff",
            backgroundColor: "#007bff",
            padding: { left: 10, right: 10, top: 5, bottom: 5 },
          })
          .setInteractive()
          .on("pointerdown", () => checkAnswer(i)); // Add interactivity

        answerButtons.push(button);
      }

      // Load the questions and start the game
      getAllHistoryQuestions().then((questions) => {
        allHistoryQuestions.push(...questions); // Populate local questions array
        displayQuestion(); // Display the first question
      });

      // Function to shuffle answers and display the current question
      const displayQuestion = () => {
        if (currentQuestionIndex < allHistoryQuestions.length) {
          const questionData = allHistoryQuestions[currentQuestionIndex];
          questionText.setText(questionData.question);

          // Shuffle answers
          const shuffledAnswers = shuffleAnswers(questionData);
          answerButtons.forEach((button, index) => {
            button.setText(shuffledAnswers[index]);
          });

          // Track the correct answer
          correctAnswer = questionData.correctAnswer;
        } else {
          endGame(); // End the game if no more questions
        }
      };

      // Function to shuffle answers
      const shuffleAnswers = (questionData) => {
        const allAnswers = [
          ...questionData.incorrectAnswers,
          questionData.correctAnswer,
        ];

        // Shuffle answers using Fisher-Yates algorithm
        for (let i = allAnswers.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [allAnswers[i], allAnswers[j]] = [allAnswers[j], allAnswers[i]];
        }
        return allAnswers;
      };

      // Function to check if the selected answer is correct
      const checkAnswer = (selectedIndex) => {
        const selectedAnswer = answerButtons[selectedIndex].text;

        if (selectedAnswer === correctAnswer) {
          score++;
          scoreText.setText(`Score: ${score}`);
        } else {
          wrongAnswer++;
          wrongText.setText(`Wrong: ${wrongAnswer}`);
        }

        if (score === 2) {
          answerButtons.forEach((button) => button.disableInteractive());
          setTimeout(() => {
            setCurrentScene("FirstScene");
            setHistoryCompleted(true);
          }, 2000); // 2000 ms = 2 seconds
        }

        if (wrongAnswer === 10) {
          answerButtons.forEach((button) => button.disableInteractive());
          setTimeout(() => setCurrentScene("FirstScene"), 1000); // 1 second delay
        }

        currentQuestionIndex++;
        displayQuestion();
      };

      // Function to end the game
      const endGame = () => {
        this.add.text(150, 500, "Game Over!", {
          fontSize: "48px",
          fill: "#ff0000",
        });

        answerButtons.forEach((button) => button.disableInteractive());
      };

      // Optionally, add a back button to return to another scene
      const backButton = this.add
        .text(400, 500, "Back to Phaser Game", {
          fontSize: "32px",
          fill: "#fff",
          backgroundColor: "#000",
        })
        .setOrigin(0.5)
        .setInteractive();

      backButton.on("pointerdown", () => {
        console.log("Returning to Phaser Game (FirstScene)...");
        setCurrentScene("FirstScene"); // Go back to the FirstScene
      });
    },
  };
};

export default HistoryScene;
