console.log("connect");
const input = document.getElementById("input");
const btn = document.getElementById("btn");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");
const pushText = document.getElementById("push-text");
const searchList = document.getElementById("search-list");
const countMemo = document.getElementById("memo-count");
let arrayMemo = [];
function saveMemo() {
  localStorage.setItem("save", JSON.stringify(arrayMemo));
}
function createMemo(memo, index) {
  const li = document.createElement("li");
  const span = document.createElement("span");
  span.textContent = memo.favorite ? "⭐" : "☆";
  span.dataset.index = index;
  span.className = "favorite";
  const text = document.createElement("span");
  text.textContent = memo.text;
  li.dataset.index = index;
  li.appendChild(span);
  li.appendChild(text);
  searchList.appendChild(li);
}
function renderMemo() {
  searchList.innerHTML = "";
  arrayMemo.forEach((memo, index) => {
    createMemo(memo, index);
  });
}
function updateCount() {
  countMemo.textContent = "メモ数：" + arrayMemo.length;
}
btn.addEventListener("click", () => {
  if (input.value.trim() === "") {
    return;
  }
  arrayMemo.push({ text: input.value, favorite: false });
  createMemo(arrayMemo[arrayMemo.length - 1], arrayMemo.length - 1);
  updateCount();
  saveMemo();
  console.table(arrayMemo);
  input.value = "";
  pushText.textContent = "";
});
input.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    btn.click();
  }
});
input.addEventListener("input", () => {
  pushText.textContent = input.value;
});
searchBtn.addEventListener("click", () => {
  if (searchInput.value.trim() === "") {
    renderMemo();
    console.table(arrayMemo);
    return;
  }
  searchList.innerHTML = "";
  const pushMemo = arrayMemo
    .map((memo, index) => {
      return { text: memo.text, favorite: memo.favorite, index: index };
    })
    .filter((memo) => {
      return memo.text.includes(searchInput.value);
    });
  pushMemo.forEach((memo, index) => {
    createMemo(memo, memo.index);
  });
  console.table(arrayMemo);
});
searchInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    searchBtn.click();
  }
});
searchInput.addEventListener("input", () => {
  searchBtn.click();
});
searchList.addEventListener("contextmenu", (event) => {
  if (event.target.tagName === "LI") {
    event.preventDefault();
    const deleteMemo = event.target.dataset.index;
    if (confirm("本当に削除しますか")) {
      arrayMemo.splice(deleteMemo, 1);
      searchInput.value = "";
      saveMemo();
      updateCount();
      renderMemo();
      console.table(arrayMemo);
    }
  }
});
searchList.addEventListener("dblclick", (event) => {
  if (event.target.tagName === "LI") {
    const index = event.target.dataset.index;
    const newMemo = prompt("メモを編集してください", arrayMemo[index].text);
    if (newMemo === null || newMemo.trim() === "") {
      return;
    }
    arrayMemo[index].text = newMemo.trim();
    saveMemo();
    renderMemo();
    console.table(arrayMemo);
  }
  searchInput.value = "";
});
searchList.addEventListener("click", (event) => {
  if (event.target.classList.contains("favorite")) {
    const index = event.target.dataset.index;
    arrayMemo[index].favorite = !arrayMemo[index].favorite;
    saveMemo();
    renderMemo();
  }
});
const saveData = localStorage.getItem("save");
if (saveData) {
  arrayMemo = JSON.parse(saveData);
  renderMemo();
  updateCount();
}
console.table(arrayMemo);
