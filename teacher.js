// Brilliance Academy – Teacher Dashboard Logic (Updated & Enhanced)
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("academy_session"));
  const welcomeText = document.getElementById("welcomeText");
  const homeworkList = document.getElementById("homeworkList");
  const submissionList = document.getElementById("submissionList");
  const topperList = document.getElementById("topperList");
  const hwForm = document.getElementById("hwForm");

  if(!user || user.role !== "teacher"){
    alert("Please login as a teacher!");
    window.location.href = "login.html";
    return;
  }

  welcomeText.textContent = `Welcome back, ${user.name} 👩‍🏫`;

  // Upload Homework
  hwForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const title = document.getElementById("hwTitle").value.trim();
    const subject = document.getElementById("hwSubject").value.trim();
    const hwClass = document.getElementById("hwClass").value;
    const text = document.getElementById("hwText").value.trim();
    const file = document.getElementById("hwFile").files[0];

    if (!title || !subject || !hwClass) {
      alert("Please fill all required fields.");
      return;
    }

    let homework = JSON.parse(localStorage.getItem("academy_homework") || "[]");

    const newHw = {
      id: Date.now(),
      title,
      subject,
      class: hwClass,
      text,
      file: file ? file.name : "",
      teacher: user.name,
      date: new Date().toLocaleString()
    };

    homework.push(newHw);
    localStorage.setItem("academy_homework", JSON.stringify(homework));
    alert("📘 Homework uploaded successfully!");
    hwForm.reset();
    renderHomework();
  });

  // Render Homework Uploaded by Teacher
  function renderHomework(){
    const allHw = JSON.parse(localStorage.getItem("academy_homework") || "[]");
    const myHw = allHw.filter(hw => hw.teacher === user.name);

    if(myHw.length === 0){
      homeworkList.innerHTML = "<p>No homework uploaded yet.</p>";
      return;
    }

    homeworkList.innerHTML = myHw.map(hw => `
      <div class="hw-card">
        <b>${hw.title}</b> — ${hw.subject} (Class ${hw.class})<br>
        <small>Uploaded: ${hw.date}</small><br>
        <button class="grade-btn" data-id="${hw.id}">View Submissions</button>
      </div>
    `).join("");

    document.querySelectorAll(".grade-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const hwId = btn.dataset.id;
        viewSubmissions(hwId);
      });
    });
  }

  // View Submissions for a Specific Homework
  function viewSubmissions(hwId){
    const submissions = JSON.parse(localStorage.getItem("academy_submissions") || "[]");
    const relatedSubs = submissions.filter(s => s.homeworkId == hwId);

    if(relatedSubs.length === 0){
      submissionList.innerHTML = "<p>No students have submitted this homework yet.</p>";
      return;
    }

    submissionList.innerHTML = relatedSubs.map((s, i) => `
      <div class="submission-card">
        <b>${s.name}</b> (Class ${s.class})<br>
        <small>Subject: ${s.subject} • ${s.date}</small><br>
        ${s.text ? `<p>${s.text}</p>` : ""}
        ${s.file ? `<a href="${s.file}" download>📄 Download PDF</a><br>` : ""}
        <p>Grade: ${s.grade || "Not graded"}</p>
        <button class="grade-btn" data-idx="${i}" data-hwid="${hwId}">Grade</button>
      </div>
    `).join("");

    document.querySelectorAll(".grade-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const idx = btn.dataset.idx;
        const hwId = btn.dataset.hwid;
        assignGrade(hwId, idx);
      });
    });
  }

  // Assign Grade to Submission
  function assignGrade(hwId, idx){
    let submissions = JSON.parse(localStorage.getItem("academy_submissions") || "[]");
    const relatedSubs = submissions.filter(s => s.homeworkId == hwId);
    const realIndex = submissions.findIndex(s => s.homeworkId == hwId && s.name === relatedSubs[idx].name);
    
    const grade = prompt("Enter grade (e.g. A+, 9/10, Excellent):");
    if(!grade) return;
    submissions[realIndex].grade = grade;
    localStorage.setItem("academy_submissions", JSON.stringify(submissions));
    alert("✅ Grade saved!");
    renderToppers();
    viewSubmissions(hwId);
  }

  // Render Toppers
  function renderToppers(){
    const submissions = JSON.parse(localStorage.getItem("academy_submissions") || "[]");
    if(submissions.length === 0){
      topperList.innerHTML = "<p>No submissions yet.</p>";
      return;
    }

    // Group by class and find top scorer
    const grouped = {};
    submissions.forEach(s => {
      if(!grouped[s.class]) grouped[s.class] = [];
      grouped[s.class].push(s);
    });

    topperList.innerHTML = Object.keys(grouped).map(cls => {
      const classSubs = grouped[cls].filter(s => s.grade);
      if(classSubs.length === 0) return "";
      const top = classSubs.sort((a,b)=>b.grade.localeCompare(a.grade))[0];
      return `
        <div class="topper-card">
          🏅 <b>${top.name}</b> (Class ${cls})<br>
          Subject: ${top.subject}<br>
          Grade: ${top.grade}
        </div>
      `;
    }).join("");
  }

  // Logout
  document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("academy_session");
    window.location.href = "login.html";
  });

  // Init
  renderHomework();
  renderToppers();
});
