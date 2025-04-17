$(document).ready(function() {
  function loadStoredData() {
    if (sessionStorage.getItem("poll-name")) {
      $(".poll-name").text(sessionStorage.getItem("poll-name"));
      $(".poll-name-res").text(sessionStorage.getItem("poll-name"));
    }
    if (sessionStorage.getItem("c1-name")) {
      $("#cn-1").text(sessionStorage.getItem("c1-name"));
      $(".c1-nme").text(sessionStorage.getItem("c1-name") + ":");
    }
    if (sessionStorage.getItem("c2-name")) {
      $("#cn-2").text(sessionStorage.getItem("c2-name"));
      $(".c2-nme").text(sessionStorage.getItem("c2-name") + ":");
    }
  }

  function storeClassVotes(classId, candidate) {
    // Get the actual class name text from the selected option
    const className = $("#class-select option:selected").text();
    const key = className + "_" + candidate;
    let classVotes = parseInt(sessionStorage.getItem(key)) || 0;
    classVotes++;
    sessionStorage.setItem(key, classVotes);
    
    // Update total votes
    const totalKey = candidate + "_total";
    let totalVotes = parseInt(sessionStorage.getItem(totalKey)) || 0;
    totalVotes++;
    sessionStorage.setItem(totalKey, totalVotes);
  }

  function voteForCandidate(candidate) {
    const classId = $("#class-select").val();
    if (!classId) {
      alert("Please select a class before voting.");
      return;
    }

    try {
      if (candidate === 1) {
        storeClassVotes(classId, "c1");
        alert("You have voted for " + $("#cn-1").text());
      } else if (candidate === 2) {
        storeClassVotes(classId, "c2");
        alert("You have voted for " + $("#cn-2").text());
      }
    } catch (error) {
      console.error("Error processing vote:", error);
      alert("There was an error processing your vote. Please try again.");
    }
  }

  function saveData() {
    const poll_name = $("#pl-input").val();
    const cand_1 = $("#cn1-inp").val();
    const cand_2 = $("#cn2-inp").val();

    sessionStorage.setItem("poll-name", poll_name);
    sessionStorage.setItem("c1-name", cand_1);
    sessionStorage.setItem("c2-name", cand_2);

    window.location.href = "index.html";
  }

  // Initial load
  loadStoredData();

  // Button event listeners
  $(".btn-1").click(function() {
    voteForCandidate(1);
  });

  $(".btn-2").click(function() {
    voteForCandidate(2);
  });

  $(".save-btn").click(function() {
    saveData();
  });
});