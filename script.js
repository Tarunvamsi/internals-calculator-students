function addComponent() {
    var componentsTableBody = document.querySelector("#componentsTable tbody");

    // Check if required fields are filled
    if (validateInputs()) {
        var newRow = componentsTableBody.insertRow();
        newRow.innerHTML = `
            <td><input type="text" class="subject" placeholder="Enter Component"></td>
            <td><input type="number" class="marks" placeholder="Marks obtained" required></td>
            <td><input type="number" class="maxMarks" placeholder="Max. Marks" required></td>
            <td><input type="number" class="weightage" placeholder="Weightage" required></td>
            <td><button class="deleteButton" onclick="deleteRow(this)">Delete</button></td>
        `;
    }
}

function deleteRow(button) {
    var row = button.parentNode.parentNode;
    row.parentNode.removeChild(row);
}

function calculateInternal() {
    // Check if required fields are filled
    if (validateInputs()) {
        var totalMarks = 0;
        var totalWeightage = 0;
        var rows = document.querySelectorAll("#componentsTable tbody tr");

        rows.forEach(function (row) {
            var marks = parseFloat(row.querySelector(".marks").value) || 0;
            var maxMarks = parseFloat(row.querySelector(".maxMarks").value) || 1;
            var weightage = parseFloat(row.querySelector(".weightage").value) || 0;

            // Check if Marks Obtained is greater than Maximum Marks
            if (marks > maxMarks) {
                alert("Marks Obtained cannot be greater than Maximum Marks.");
                return;
            }

            totalMarks += (marks / maxMarks) * weightage;
            totalWeightage += weightage;
        });

        var resultMessage = `Your internal score is ${totalMarks.toFixed(2)}/${totalWeightage}`;
        document.getElementById("totalMarks").innerText = resultMessage;

        // Update the link with the template
        var linkTemplate = encodeURIComponent(getMarksTemplate());
        document.getElementById("link").innerText = `Use this link to update marks: ${window.location.href}?template=${linkTemplate}`;
    }
}

function validateInputs() {
    var rows = document.querySelectorAll("#componentsTable tbody tr");

    for (var i = 0; i < rows.length; i++) {
        var marks = rows[i].querySelector(".marks").value.trim();
        var maxMarks = rows[i].querySelector(".maxMarks").value.trim();
        var weightage = rows[i].querySelector(".weightage").value.trim();

        if (marks === "" || maxMarks === "" || weightage === "") {
            alert("Please fill in all required fields.");
            return false;
        }
    }

    return true;
}

function getMarksTemplate() {
    var template = [];
    var rows = document.querySelectorAll("#componentsTable tbody tr");

    rows.forEach(function (row) {
        var componentName = row.querySelector(".subject").value;
        var marks = row.querySelector(".marks").value;
        var maxMarks = row.querySelector(".maxMarks").value;
        var weightage = row.querySelector(".weightage").value;

        template.push({
            componentName: componentName,
            marks: marks,
            maxMarks: maxMarks,
            weightage: weightage
        });
    });

    return JSON.stringify(template);
}

function generateLink() {
    var linkTemplate = encodeURIComponent(getMarksTemplate());
    document.getElementById("link").innerText = `Use this link to update marks: ${window.location.href}?template=${linkTemplate}`;
}


// Function to extract template from the URL and populate the table
function loadMarksFromTemplate() {
    var urlParams = new URLSearchParams(window.location.search);
    var templateParam = urlParams.get('template');

    if (templateParam) {
        var template = JSON.parse(decodeURIComponent(templateParam));

        template.forEach(function (item) {
            var componentsTableBody = document.querySelector("#componentsTable tbody");
            var newRow = componentsTableBody.insertRow();
            newRow.innerHTML = `
                <td><input type="text" class="subject" value="${item.componentName || ''}"></td>
                <td><input type="number" class="marks" value="${item.marks || 0}" required></td>
                <td><input type="number" class="maxMarks" value="${item.maxMarks || 1}" required></td>
                <td><input type="number" class="weightage" value="${item.weightage || 0}" required></td>
                <td><button class="deleteButton" onclick="deleteRow(this)">Delete</button></td>
            `;
        });
    }
}

// Call this function on page load to load marks from the URL template
loadMarksFromTemplate();
