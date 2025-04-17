
$(document).ready(function() {
  function generateClassVotesTable() {
    const tableBody = $("#class-votes-table tbody");
    tableBody.empty();
    
    // Create a map to store class votes
    const classVotes = new Map();
    
    // Collect all class votes
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.includes("_c1") || key.includes("_c2"))) {
        const [classId, candidate] = key.split("_");
        if (!classVotes.has(classId)) {
          classVotes.set(classId, { c1: 0, c2: 0 });
        }
        const votes = parseInt(sessionStorage.getItem(key)) || 0;
        classVotes.get(classId)[candidate] = votes;
      }
    }

    // Generate table rows sorted by class ID
    Array.from(classVotes.keys())
      .sort()
      .forEach(classId => {
        const votes = classVotes.get(classId);
        const row = `<tr>
          <td>${classId}</td>
          <td>${votes.c1} votes</td>
          <td>${votes.c2} votes</td>
        </tr>`;
        tableBody.append(row);
      });
  }

  function updateTotalVotes() {
    let c1Total = 0;
    let c2Total = 0;

    // Calculate total votes from all classes
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && key.includes("_c1")) {
        c1Total += parseInt(sessionStorage.getItem(key)) || 0;
      } else if (key && key.includes("_c2")) {
        c2Total += parseInt(sessionStorage.getItem(key)) || 0;
      }
    }
    
    // Update the display
    $(".c1-votes").text(c1Total + " votes");
    $(".c2-votes").text(c2Total + " votes");
    
    // Store totals
    sessionStorage.setItem("c1_votes", c1Total);
    sessionStorage.setItem("c2_votes", c2Total);
  }

  function loadStoredData() {
    // Load poll name and candidate names
    const pollName = sessionStorage.getItem("poll-name") || "Poll Results";
    const c1Name = sessionStorage.getItem("c1-name") || "Candidate 1";
    const c2Name = sessionStorage.getItem("c2-name") || "Candidate 2";

    $(".poll-name-res").text(pollName);
    $(".c1-nme").text(c1Name + ":");
    $(".c2-nme").text(c2Name + ":");

    // Update votes
    updateTotalVotes();
    generateClassVotesTable();
  }

  function resetAllResults() {
    if (confirm("Are you sure you want to reset all results? This cannot be undone.")) {
      // Clear all voting data from sessionStorage
      for (let i = sessionStorage.length - 1; i >= 0; i--) {
        const key = sessionStorage.key(i);
        if (key && (key.includes('votes') || key.includes('_c1') || key.includes('_c2') || key.includes('_voted'))) {
          sessionStorage.removeItem(key);
        }
      }
      loadStoredData();
      alert("All results have been reset!");
    }
  }

  function exportResults() {
    // Gather results data
    const results = {
      pollName: $(".poll-name-res").text(),
      candidate1: {
        name: $(".c1-nme").text().replace(":", ""),
        votes: sessionStorage.getItem("c1_votes") || 0
      },
      candidate2: {
        name: $(".c2-nme").text().replace(":", ""),
        votes: sessionStorage.getItem("c2_votes") || 0
      },
      classResults: []
    };

    // Get class-wise results
    $("#class-votes-table tbody tr").each(function() {
      const cells = $(this).find("td");
      results.classResults.push({
        class: $(cells[0]).text(),
        candidate1Votes: $(cells[1]).text(),
        candidate2Votes: $(cells[2]).text()
      });
    });

    // Create CSV content
    let csv = `Poll Name: ${results.pollName}\n\n`;
    csv += `${results.candidate1.name},${results.candidate1.votes}\n`;
    csv += `${results.candidate2.name},${results.candidate2.votes}\n\n`;
    csv += "Class,Candidate 1 Votes,Candidate 2 Votes\n";
    results.classResults.forEach(row => {
      csv += `${row.class},${row.candidate1Votes},${row.candidate2Votes}\n`;
    });

    // Create and trigger download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.setAttribute('hidden', '');
    a.setAttribute('href', url);
    a.setAttribute('download', 'voting_results.csv');
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  // Initial load
  loadStoredData();

  // Refresh data every 2 seconds
  setInterval(loadStoredData, 2000);

  // Button event listeners
  $("#resetBtn").click(resetAllResults);
  $("#exportBtn").click(exportResults);
});
