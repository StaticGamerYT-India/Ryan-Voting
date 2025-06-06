$(document).ready(function() {
  function loadStoredData() {
    if (localStorage.getItem("poll-name")) {
      $(".poll-name").text(localStorage.getItem("poll-name"));
      $(".poll-name-res").text(localStorage.getItem("poll-name"));
    }
    if (localStorage.getItem("c1-name")) {
      $("#cn-1").text(localStorage.getItem("c1-name"));
      $(".c1-nme").text(localStorage.getItem("c1-name") + ":");
    }
    if (localStorage.getItem("c2-name")) {
      $("#cn-2").text(localStorage.getItem("c2-name"));
      $(".c2-nme").text(localStorage.getItem("c2-name") + ":");
    }
  }

  function storeClassVotes(classId, candidate) {
    // Get the actual class name text from the selected option
    const className = $("#class-select option:selected").text();
    const key = className + "_" + candidate;
    let classVotes = parseInt(localStorage.getItem(key)) || 0;
    classVotes++;
    localStorage.setItem(key, classVotes);
    
    // Update total votes
    const totalKey = candidate + "_total";
    let totalVotes = parseInt(localStorage.getItem(totalKey)) || 0;
    totalVotes++;
    localStorage.setItem(totalKey, totalVotes);
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

    if (!poll_name || !cand_1 || !cand_2) {
      alert("Please fill in all fields before saving.");
      return;
    }

    localStorage.setItem("poll-name", poll_name);
    localStorage.setItem("c1-name", cand_1);
    localStorage.setItem("c2-name", cand_2);

    alert("Settings saved successfully!");
    window.location.href = "index.html";
  }

  function loadSettingsData() {
    if (localStorage.getItem("poll-name")) {
      $("#pl-input").val(localStorage.getItem("poll-name"));
    }
    if (localStorage.getItem("c1-name")) {
      $("#cn1-inp").val(localStorage.getItem("c1-name"));
    }
    if (localStorage.getItem("c2-name")) {
      $("#cn2-inp").val(localStorage.getItem("c2-name"));
    }
  }

  function clearVoteRestrictions() {
    // Remove any old "_voted" flags that might be preventing votes
    for (let i = localStorage.length - 1; i >= 0; i--) {
      const key = localStorage.key(i);
      if (key && key.includes('_voted')) {
        localStorage.removeItem(key);
      }
    }
  }

  // Initial load
  loadStoredData();

  // Clear any existing vote restrictions on page load
  clearVoteRestrictions();

  // Load settings data if on settings page
  if (window.location.pathname.includes('settings.html')) {
    loadSettingsData();
  }

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
