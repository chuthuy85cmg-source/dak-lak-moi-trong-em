// Menu điều hướng cho điện thoại
const menuToggle = document.querySelector("#menuToggle");
const mainNav = document.querySelector("#mainNav");

menuToggle.addEventListener("click", () => {
  const isOpen = mainNav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
  });
});

// Trò chơi trắc nghiệm mẫu. Hãy kiểm chứng và bổ sung câu hỏi theo học liệu của nhóm.
const questions = [
  {
    question: "Khi giới thiệu một tư liệu văn hóa trên website, việc nào nên làm?",
    answers: [
      "Đăng ngay mà không cần kiểm tra",
      "Ghi nguồn và kiểm chứng thông tin",
      "Xóa tên người tạo tư liệu",
      "Sử dụng mọi hình ảnh tìm thấy trên mạng"
    ],
    correct: 1,
    explanation: "Chính xác! Ghi nguồn và kiểm chứng giúp tôn trọng tác giả, đồng thời tăng độ tin cậy."
  },
  {
    question: "Nếu muốn đăng video phỏng vấn một nghệ nhân, nhóm nên làm gì trước?",
    answers: [
      "Xin phép người tham gia và thống nhất cách sử dụng video",
      "Đăng công khai ngay",
      "Chỉ cần đổi tên tệp",
      "Không cần hỏi vì đây là bài tập"
    ],
    correct: 0,
    explanation: "Đúng rồi! Cần xin phép và tôn trọng quyền riêng tư của người tham gia."
  },
  {
    question: "Mục tiêu phù hợp nhất của thư viện số “Đắk Lắk mới trong em” là gì?",
    answers: [
      "Chỉ trang trí cho đẹp",
      "Thay thế mọi hoạt động trải nghiệm thực tế",
      "Giúp học sinh khám phá, học hỏi và góp phần gìn giữ văn hóa",
      "Chỉ lưu trữ trò chơi"
    ],
    correct: 2,
    explanation: "Chính xác! Website kết hợp học liệu và trải nghiệm để giúp lan tỏa giá trị văn hóa."
  }
];

let currentQuestion = 0;
let score = 0;
let answered = false;

const questionText = document.querySelector("#questionText");
const answerOptions = document.querySelector("#answerOptions");
const questionCounter = document.querySelector("#questionCounter");
const progressBar = document.querySelector("#progressBar");
const quizFeedback = document.querySelector("#quizFeedback");
const scoreText = document.querySelector("#scoreText");
const nextQuestion = document.querySelector("#nextQuestion");

function renderQuestion() {
  answered = false;
  const item = questions[currentQuestion];
  questionText.textContent = item.question;
  questionCounter.textContent = `Câu ${currentQuestion + 1}/${questions.length}`;
  progressBar.style.width = `${(currentQuestion / questions.length) * 100}%`;
  answerOptions.replaceChildren();
  quizFeedback.textContent = "";
  nextQuestion.disabled = true;
  nextQuestion.textContent = currentQuestion === questions.length - 1 ? "Xem kết quả →" : "Câu tiếp theo →";

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-option";
    button.textContent = `${String.fromCharCode(65 + index)}. ${answer}`;
    button.addEventListener("click", () => chooseAnswer(index, button));
    answerOptions.appendChild(button);
  });
}

function chooseAnswer(index, selectedButton) {
  if (answered) return;
  answered = true;
  const item = questions[currentQuestion];
  const buttons = [...answerOptions.querySelectorAll("button")];
  buttons.forEach((button) => { button.disabled = true; });
  buttons[item.correct].classList.add("correct");

  if (index === item.correct) {
    score++;
    quizFeedback.textContent = `✓ ${item.explanation}`;
  } else {
    selectedButton.classList.add("incorrect");
    quizFeedback.textContent = `Chưa chính xác. ${item.explanation}`;
  }
  scoreText.textContent = `Điểm: ${score}/${questions.length}`;
  progressBar.style.width = `${((currentQuestion + 1) / questions.length) * 100}%`;
  nextQuestion.disabled = false;
}

nextQuestion.addEventListener("click", () => {
  if (!answered) return;
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  } else {
    questionText.textContent = `Bạn đạt ${score}/${questions.length} điểm!`;
    answerOptions.replaceChildren();
    quizFeedback.textContent = score === questions.length
      ? "Tuyệt vời! Hãy tiếp tục khám phá và chia sẻ kiến thức văn hóa."
      : "Cảm ơn bạn đã tham gia. Hãy đọc thêm học liệu rồi thử lại nhé!";
    progressBar.style.width = "100%";
    questionCounter.textContent = "Hoàn thành";
    nextQuestion.textContent = "Chơi lại ↻";
    nextQuestion.disabled = false;
    nextQuestion.onclick = () => {
      currentQuestion = 0;
      score = 0;
      scoreText.textContent = "Điểm: 0";
      nextQuestion.onclick = null;
      renderQuestion();
    };
  }
});

renderQuestion();

// Tìm kiếm trong các thẻ nội dung đơn giản trên trang
const resourceSearch = document.querySelector("#resourceSearch");
const searchResult = document.querySelector("#searchResult");
resourceSearch.addEventListener("input", () => {
  const query = resourceSearch.value.trim().toLocaleLowerCase("vi");
  const cards = [...document.querySelectorAll(".resource-card, .story-card")];
  let visible = 0;
  cards.forEach((card) => {
    const match = card.textContent.toLocaleLowerCase("vi").includes(query);
    card.classList.toggle("is-hidden", Boolean(query) && !match);
    if (!query || match) visible++;
  });
  searchResult.textContent = query
    ? `Tìm thấy ${visible} thẻ nội dung phù hợp.`
    : "Nhập từ khóa để lọc các thẻ nội dung trên trang.";
});

// Xem thử tệp âm thanh/video được chọn trên máy của người dùng; không tải lên Internet.
const audioUpload = document.querySelector("#audioUpload");
const audioPlayer = document.querySelector("#audioPlayer");
audioUpload.addEventListener("change", () => {
  const file = audioUpload.files[0];
  if (!file) return;
  audioPlayer.src = URL.createObjectURL(file);
  audioPlayer.hidden = false;
  audioPlayer.load();
});

const videoUpload = document.querySelector("#videoUpload");
const videoPlayer = document.querySelector("#videoPlayer");
videoUpload.addEventListener("change", () => {
  const file = videoUpload.files[0];
  if (!file) return;
  videoPlayer.src = URL.createObjectURL(file);
  videoPlayer.hidden = false;
  videoPlayer.load();
});

// Biểu mẫu minh họa: hiện hiển thị tóm tắt ngay trên trang, chưa lưu/gửi dữ liệu.
const suggestionForm = document.querySelector("#suggestionForm");
const formMessage = document.querySelector("#formMessage");
suggestionForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const formData = new FormData(suggestionForm);
  formMessage.textContent = `Bản nháp: “${formData.get("title")}” (${formData.get("type")}). Đây chỉ là bản xem trước; dữ liệu chưa được gửi hoặc lưu.`;
});
