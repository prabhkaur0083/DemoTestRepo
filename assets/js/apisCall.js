// FilterData
let selectedfilters = [];
let pageId = ""

function setPageId(reportPageId) {
  pageId = reportPageId;

};


// Define the base URL of your API
const baseURL = "https://infin-backend-container-eygdbefchbcqg8e8.centralindia-01.azurewebsites.net"; // Update this to your FastAPI server address

// const baseURL = "http://0.0.0.0:8081";
// Function to fetch visual data from the FastAPI endpoint
async function fetchVisualData(workspaceId, reportId, pagename) {
  try {
    // Construct the full URL for the request
    const url = `${baseURL}/api/v1/report/visual/${workspaceId}/${reportId}/${pagename}`;

    // Make a GET request to the FastAPI endpoint
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json"
      }
    });

    // Check if the request was successful
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();

    // Return the data
    return data;

  } catch (error) {
    // Handle any errors
    console.error('Error fetching visual data:', error);
  }
}

async function fetchJsonData(filepath) {
  try {
    const response = await fetch(`${baseURL}/api/v1/report/visualJson/${filepath}/get`);
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();

    return data;


  } catch (error) {
    console.error('Error fetching data:', error);
    document.getElementById('message').innerText = 'Failed to load data';
  }
}


async function filterData(reportpageId) {
  const workspaceId = "beea22fe-2757-4adc-82b0-6795671b4c4f";
  const reportId = "c7cf06fc-f6a8-4bed-8a8f-3d5b88d8bb3e";


  const requestBody = {
    workspaceId: workspaceId,
    reportId: reportId,
    pagename: reportpageId,
    filters: selectedfilters
  };

  // Show loader
  showLoader()
  document.getElementById('loader').style.display = 'block';


  $.ajax({
    url: `${baseURL}/api/v1/report/visual/get`,
    type: 'POST',
    contentType: 'application/json',
    data: JSON.stringify(requestBody),
    success: function (data) {
      fetchData(data);
      return data
      // Handle the response data here
    },
    error: function (xhr) {
      console.error(`Error calling API: HTTP status ${xhr.status}`);
    },
    complete: function () {
      // Hide loader
      $('#loader').hide();
      hideLoader()
    }
  });
}



// Function to send visual data based on selected filters
async function sendVisualData(filepath = null) {
  let data;

  // Check if selectedfilters array has values
  if (selectedfilters.length > 0) {
    // Fetch data from FastAPI endpoint if filters are applied
    data = filterData();
  } else {
    // Fetch data from a JSON file if no filters are applied
    data = await fetchJsonData(filepath);
  }

  // Process the data (this can be customized as per your requirement)
  if (data) {
    // You can now use this data to update the page or send it to another service
  } else {
    console.error('No data received');
  }
  return data;
}



// Async function to handle page load
async function onPageLoad(filepath) {
  try {
    // Fetch visual data based on the filters
    // const data = await fetchVisualData(workspaceId, reportId, pagename);

    // Fetch data from JSON or API
    const data = await sendVisualData(filepath); // Wait for the data to be fetched
    // Pass the fetched data to fetchData
    await fetchData(data); // Ensure fetchData is called with actual data
  } catch (error) {
    console.error("Error during page load data fetch:", error);
  }
}

// Function to handle the Apply button click
async function enableFilterdata(ReportpageId) {

  // Fetch visual data based on the filters
  const data = await filterData(ReportpageId);

  // if (data) {
  //     await fetchData(data);

  // }
}

function handleOptionClick(option, slicerId, slicerTable, slicerColumn) {

  const input = document.getElementById(option);

  // Initialize selectedfilters array if not already initialized
  if (typeof selectedfilters === 'undefined') {
    selectedfilters = [];
  }

  // Find if the current slicerId already exists in selectedfilters
  let existingFilter = selectedfilters.find(item => item.SlicerId === slicerId);

  if (input.checked) {
    if (input.type === "radio") {
      // If it's a radio button, clear existing selection for this SlicerId
      if (existingFilter) {
        existingFilter.SlicerValue = [input.value];
      } else {
        // Add new entry if SlicerId doesn't exist
        selectedfilters.push({
          SlicerId: slicerId,
          SlicerValue: [input.value],
        });
      }
    } else if (input.type === "checkbox") {
      // If it's a checkbox, add the value if it doesn't already exist
      if (existingFilter) {
        if (!existingFilter.SlicerValue.includes(input.value)) {
          existingFilter.SlicerValue.push(input.value);
        }
      } else {
        // Add new entry if SlicerId doesn't exist
        selectedfilters.push({
          SlicerId: slicerId,
          SlicerValue: [input.value],
        });
      }
    }
  } else {
    // If the input is unchecked and it's a checkbox, remove the value
    if (input.type === "checkbox" && existingFilter) {
      existingFilter.SlicerValue = existingFilter.SlicerValue.filter(val => val !== input.value);

      // If no values left in SlicerValue, remove the entire filter entry
      if (existingFilter.SlicerValue.length === 0) {
        selectedfilters = selectedfilters.filter(item => item.SlicerId !== slicerId);
      }
    }
  }


  enableFilterdata(pageId);

  // Enable Apply filter Button
  toggleApplyButton();
}


function toggleApplyButton() {
  const applyButton = document.getElementById('applyButton');

  if (selectedfilters.length > 0) {
    applyButton.disabled = false;
    applyButton.classList.remove('btn-secondary'); // Remove gray-out class if applicable
    applyButton.classList.add('btn-danger'); // Add the danger (red) class back
  } else {
    applyButton.disabled = true;
    applyButton.classList.remove('btn-danger');
    applyButton.classList.add('btn-secondary'); // Optional: visually gray out the button
  }
}

// Function to create a card
function createCard(content, title, containerId, comparisonValue, variance, dynamicTitle, dynamicColor, seriesData) {

  document.getElementById(containerId).textContent = ""
  iconClass = getIconForHeading(title)

  // Create the card structure
  const cardHTML = `
  <div class="card card-stats shadow-lg">
  <div class="card-body" style="height:100px; ">
    <div class = "row align-items-center" >
      <div class="col-4 text-center">
        <div class="icon-big text-success">
          <i class="${iconClass}" style="color:#5834db"></i>
        </div>
      </div>
      <div class = "col-8" >
        <div class="numbers" >
          <p class="card-category text-center" style="font-size: 0.75rem; margin-left:-20px; color:black;">${title}</p>
          <h4 class="card-title text-center" style="font-weight: bold; margin-left:-20px;">${content}</h4>
        </div>
      </div>
       <div class="card-footer" style="padding: 0px 10px; background-color: white; ">
    
        <div class="text-center" style="font-size: 0.75rem; word-spacing: 3px;">
         ${dynamicTitle} ${comparisonValue} <span style="color:${dynamicColor.toLowerCase() === 'light green' ? 'green' : dynamicColor};">${variance}</span>
        </div>      
       </div>
    </div>
   
  </div>
  ${
      seriesData
        ? `<div style="width: 100%; padding: 3px;">
             <canvas id="${containerId}-chart" style="height: 50px; width: 100%;"></canvas>
           </div>`
        : ""
    }
  
</div>

`;

  // Append the card to the card container
  document.getElementById(containerId).innerHTML += cardHTML;

  const yAxisData = seriesData[0].Yaxis;
  const minValue = Math.min(...yAxisData);
  const maxValue = Math.max(...yAxisData);

  // Generate point colors based on values
  const pointColors = yAxisData.map(value => {
    if (value === minValue) return 'red'; // Lowest point
    if (value === maxValue) return 'green'; // Highest point
    return 'lightblue'; // Other points
  });


  const chartCanvas = document.getElementById(`${containerId}-chart`);
  new Chart(chartCanvas, {
    type: 'line',
    data: {
      labels: seriesData[0].Xaxis, // Use actual x-axis labels
      datasets: [{
        data: seriesData[0].Yaxis, // Example data
        borderColor: 'blue', // Line color
        backgroundColor: 'lightgrey', // Fill color
        borderWidth: 1,
        pointRadius: 2, // Point size
        pointBackgroundColor: pointColors, // Border color for the points
        tension: 0.01, // Smooth curve
        fill: {
          target: {
            value: Math.min(...seriesData[0].Yaxis) // Fill to the minimum value of the dataset
          }
        }
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: false
        }, // Hide legend
        tooltip: {
          enabled: true, // Enable tooltips
          callbacks: {
            // Customize tooltip content
            label: function (context) {
              const xLabel = context.label; // Get x-axis label
              const yValue = context.raw; // Get y-axis value
              return `${yValue}`; // Custom tooltip format
            }
          }
        },
        datalabels: {
          display: false // Hide data labels
        }
      },
      scales: {
        x: {
          display: false, // Completely hide x-axis (labels and grid lines)
        },
        y: {
          display: false, // Completely hide y-axis (labels and grid lines)
          beginAtZero: true // Forces baseline at 0
        }
      },
      layout: {
        padding: 0 // No padding
      }
    }
  });




}

// Function to create a table
function createTable(Title, Columns, Rows, visualTable) {

  document.getElementById(visualTable).textContent = ""
  // Create the table structure
  const tableHTML = `
      <div class="card">
        <div class="card-header">
          <div class="card-title">${Title}</div>
        </div>
        <div class="card-body">
          <div style="max-height: 600px; overflow-y: auto;"> <!-- Set fixed height for rows and enable scrolling -->
            <table class="table table-hover" style="table-layout: fixed; width: 100%;">
              <thead style="position: sticky; top: 0; background-color: white; z-index: 1;">
                <tr>
                  ${Columns.map(column => `<th scope="col">${column}</th>`).join('')}
                </tr>
              </thead>
              <tbody>
                ${Rows.map((row, index) => `
                  <tr>
                    ${row.map(cell => `<td>${cell}</td>`).join('')}
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>`;


  // Append the table to the specified container
  document.getElementById(visualTable).innerHTML += tableHTML;
}

function createAdvanceSlicer(Title, options, visualId, slicerId, tableName, columnName, slicerValue) {
  document.getElementById(visualId).textContent = ""
  let slicerContent = `
        <div class="row g-3 d-flex justify-content-end"> <!-- Bootstrap row with gap between columns -->
    `;

  // Loop through the options array to create individual buttons
  options.forEach(option => {
    // Ensure option is not an empty string before adding
    if (option.trim()) {
      slicerContent += `
                <div class="col-md-3 pb-3 " style=position:"relative;">
                    <button class="btn btn-sm text-light fixed-size-button " id="advanceSlicer" style="position:relative; top:40px; z-index:2; background-color: #5834db;" type="button" onclick="handleadvbuttonFilters('${option}', '${slicerId}', '${tableName}','${columnName}')" >
                        ${option}
                    </button>
                </div>
            `;
    }
  });

  slicerContent += `</div>`; // Close the row

  document.getElementById(visualId).innerHTML += slicerContent;

}

function showPopup(label, value) {
  const modal = document.getElementById("popupModal");
  const content = document.getElementById("popupContent");
  content.textContent = `Label: ${label}\nValue: ${value}`;
  modal.style.display = "block";
}

function closePopup() {
  document.getElementById("popupModal").style.display = "none";
}


// Register the ChartDataLabels plugin globally
Chart.register(ChartDataLabels);

function createChart(chartData, x, y, visualId, chartType) {
  document.getElementById(visualId).textContent = "";

  const htmlStructure = `
    <div class="col-md-12">
      <div class="" style="border-radius: 15px;">
        <div class="card-header">
          <div class="card-title fw-bold">${chartData}</div>
        </div>
        <div class="card-body">
          <div 
            class="chart-container" 
            style="display:flex; justify-content:center; align-items:end; width: 100%; height: 300px; position:relative;">
            <canvas id="lineChart${visualId}" style="max-height: 100%; max-width: 100%;"></canvas>
          </div>
        </div>
      </div>
    </div>
  `;

  // Insert the HTML structure into the target element
  document.getElementById(visualId).innerHTML += htmlStructure;

  // Initialize the chart
  const chartCanvas = document.getElementById(`lineChart${visualId}`);

  new Chart(chartCanvas, {
    type: chartType,
    data: {
      labels: x,
      datasets: [{
        fill: true,
        lineTension: 0.3,
        backgroundColor: "#5834db",
        borderColor: "#CCCCFF",
        hoverBackgroundColor: "#5dade2",
        hoverBorderColor: "#FF0000",
        data: y,
      }, ],
    },
    options: {
      maintainAspectRatio: false, // Allow the chart to fill the div's dimensions
      responsive: true, // Make the chart responsive
       plugins: {
                   legend: {
                     display: false, // Hide the legend
                   },
                   title: {
                     display: true,
                     text: "",
                     color: "#5834db",
                     font: {
                       size: 18 // Adjust the size as desired
                     }
                   },
                   datalabels: x.length < 10 ? { // Apply datalabels only when there are fewer than 10 bars
                     anchor: "end",
                     align: "end",
                     color: "#2A2F5B",
                     font: {
                       weight: "bold",
                     },
                     formatter: (value, context) => {
                       const minValue = Math.min(...context.dataset.data);

                       if (minValue >= 1000000) {
                         value = '$' + (value / 1000000).toFixed(1) + 'M'; // Format as millions
                       } else if (minValue >= 1000) {
                         value = '$' + Math.round(value / 1000) + 'K'; // Format as thousands
                       } else {
                         value = value; // Keep the original value
                       }

                       return `${value}`; // Return the formatted value
                     }
                   } : false,
        tooltip: {
          callbacks: {
            label: function (tooltipItem) {
              let value = tooltipItem.raw; // Get the raw value from the dataset
              return `${value}`; // Return the formatted value with '$' symbol
            },
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false, // Hide x-axis grid lines
          },
          ticks: {
            min: 0,
          },
        },
        y: {
          grid: {
            display: false, // Hide y-axis grid lines
          },
          ticks: {
            display: false, // Hide y-axis ticks (values)
          },
        },
      },
      barThickness: x.length > 3 ? undefined : 45,
      onClick: async (event, elements) => {
        if (elements.length > 0) {
          const index = elements[0].index;
          const value = elements[0].element.$context.raw;

          const xAxisLabel = event.chart.data.labels[index];
          const drilData = await DrillThroughFilter(xAxisLabel, chartData);

          const modal = document.getElementById("popupModal");
          const content = document.getElementById("popupContent");

          content.innerHTML = "";

          const table = document.createElement("table");
          const tableHeader = `
            <thead>
              <tr>
                <th>Deal Name</th>
                <th>AE Owner </th>
                <th>Deal Amount</th>
                <th>Region</th>
                <th>Industry</th>
                <th>DealType</th>
                <th>DealStage</th>
                <th>Create Date</th>
              </tr>
            </thead>
          `;

          let tableRows = "<tbody>";
          if (Array.isArray(drilData.Data.Data)) {
            drilData.Data.Data.forEach((item, index) => {
              const formattedDate = new Date(item.CreateDate).toLocaleDateString("en-US");
              tableRows += `
                <tr>
                  <td>${item.DealName}</td>
                  <td>${item.AccoutAEOwner} </td>
                  <td>${item.DealAmount}</td>
                  <td>${item.Region || "N/A"}</td>
                  <td>${item.Industry}</td>
                  <td>${item.DealType}</td>
                  <td>${item.Stage}</td>
                  <td>${formattedDate}</td>
                </tr>
              `;
            });
          } else {
            tableRows += `<tr><td colspan="9">No data available</td></tr>`;
          }

          tableRows += "</tbody>";
          table.innerHTML = tableHeader + tableRows;

          table.style.width = "100%";
          const header = table.querySelector("thead");
          header.style.position = "sticky";
          header.style.top = "0";
          header.style.backgroundColor = "white";
          header.style.zIndex = "1";

          const tableContainer = document.createElement("div");
          tableContainer.style.height = "500px";
          tableContainer.style.overflowY = "auto";
          tableContainer.appendChild(table);

          content.appendChild(tableContainer);

          modal.style.display = "block";
        }
      },
    },
  });
}


// Function to display drill-down data in a modal
function displayModal(drillData) {
  const modal = document.getElementById("popupModal");
  const content = document.getElementById("popupContent");

  // Clear any previous content
  content.innerHTML = '';

  // Create the table HTML
  const table = document.createElement('table');
  const tableHeader = `
    <thead>
      <tr>
        <th>Sr No.</th>
        <th>Deal Name</th>
        <th>Deal Amount</th>
        <th>Region</th>
        <th>Industry</th>
        <th>DealType</th>
        <th>DealStage</th>
        <th>LeadSource</th>
        <th>Create Date</th>
      </tr>
    </thead>
  `;

  let tableRows = '<tbody>';
  if (Array.isArray(drillData.Data.Data)) {
    drillData.Data.Data.forEach((item, index) => {
      const formattedDate = new Date(item.CreateDate).toLocaleDateString("en-US");
      tableRows += `
        <tr>
          <td>${index + 1}</td>
          <td>${item.DealName}</td>
          <td>${item.DealAmount}</td>
          <td>${item.Region || 'N/A'}</td>
          <td>${item.Industry}</td>
          <td>${item.DealType}</td>
          <td>${item.Stage}</td>
          <td>${item.LeadSource}</td>
          <td>${formattedDate}</td>
        </tr>
      `;
    });
  } else {
    tableRows += `<tr><td colspan="9">No data available</td></tr>`;
  }

  tableRows += '</tbody>';
  table.innerHTML = tableHeader + tableRows;
  content.appendChild(table);

  // Show the modal
  modal.style.display = "block";
}





//create Donut Chart
function createDonutChart(chartData, x, y, visualId) {
  document.getElementById(visualId).textContent = ""
  const htmlStructure = `
  <div class="col-md-12" >
    <div  style="border-radius: 15px; ">
      <div class="card-header">
        <div class="card-title  fw-bold">${chartData}</div>
      </div>
      <div class="card-body">
        <div class = "chart-container"
        style = "position: relative; height:100px; display:flex; justify-content:center" >
          <canvas id="lineChart${visualId}" style="width: 50%; height: 50%;"></canvas>
        </div>
      </div>
    </div>
  </div>
`;

  // Insert the HTML structure into the target element
  document.getElementById(visualId).innerHTML += htmlStructure;

  // Initialize the chart
  const chartCanvas = document.getElementById(`lineChart${visualId}`);

  // Create the chart
  var myDoughnutChart = new Chart(chartCanvas, {
    type: 'doughnut', // Specify the chart type as doughnut
    data: {
      labels: x, // Labels for your segments
      datasets: [{
        label: 'My Doughnut Chart',
        data: y, // Data values for each segment
        backgroundColor: [
          '#5834db',
          '#0530ad',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
          '#6082B6',
          '#6082B6',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true, // Makes the chart responsive to the screen size
      plugins: {
        legend: {
          position: 'top', // Position the legend at the top

        },
        tooltip: {
          enabled: true // Enable tooltips when hovering over segments
        },
        datalabels: {
          color: 'white', // Set the value color to white
          font: {
            weight: 'bold', // Optional: Make the font bold
            size: 14, // Optional: Adjust font size
          }
        }
      }
    }
  });
}



// Function to create the dropdown
function createDropdown(Title, Options, visualId, slicerId, slicerTable, slicerColumn, slicerValue) {
  document.getElementById(visualId).textContent = "";

  // Set the display value
  let displayValue = slicerValue.length === 0 ? "Select Value" : slicerValue;

  // Determine whether to use radio or checkbox based on Title
  const inputType = (Title.includes("Year") || Title.includes("Comparison To")) ? "radio" : "checkbox";

  // Create the dropdown HTML structure
  let dropdownHTML = `
        <div class="row g-3"> 
            <div class="col-md-4">
                <div class="btn-group">
                    <button
                        class="btn btn-sm dropdown-toggle fixed-size-button text-light border"
                        type="button"
                        data-bs-toggle="dropdown"
                        aria-expanded="false"
                        style="background-color: #5834db; width: 120px;"
                    >
                        ${displayValue}
                    </button>
                    <ul class="dropdown-menu" role="menu" style="padding: 10px; max-height: 200px; overflow-y: auto;">
    `;

  // Loop through options and add inputs (radio/checkbox) as <li> elements
  Options.forEach(option => {
    if (option) {
      // Check if the option matches the display value, and set `checked` if it does
      const isChecked = Array.isArray(displayValue) && displayValue.includes(option) ? "checked" : "";

      dropdownHTML += `
                <li class="dropdown-item" style="padding: 0; margin: 5px 0;">
                    <div class="form-check" style="padding: 2px;">
                        <input class="form-check-input"
                               type="${inputType}"
                               name="${slicerId}"
                               value="${option}"
                               id="${option}"
                                
                               style="width: 16px; height: 16px;"
                               onclick="handleOptionClick('${option}', '${slicerId}', '${slicerTable}', '${slicerColumn}')" ${isChecked}>
                        <label class="form-check-label" for="${option}" style="font-size: 0.85rem; margin-left: 6px;">
                            ${option}
                        </label>
                    </div>
                </li>`;
    }
  });
  // Close the dropdown HTML structure
  dropdownHTML += `
                </ul>
            </div>
        </div>
    </div>
`;

  // Append the dropdown to the specified container
  document.getElementById(visualId).innerHTML += dropdownHTML;
}

async function handleadvbuttonFilters(option, slicerId, slicerTable, slicerColumn) {
  // Check if the current slicerId already exists in selectedfilters
  let existingFilter = selectedfilters.find(item => item.SlicerId === slicerId);

  // If the slicerId exists, add the value to the SlicerValue array if it's not already there
  if (existingFilter) {
    if (!existingFilter.SlicerValue.includes(option)) {
      existingFilter.SlicerValue.push(option);
    }
  } else {
    // If the slicerId doesn't exist, create a new object and add it to selectedfilters
    selectedfilters.push({
      SlicerId: slicerId,
      SlicerValue: [option]
    });
  }

  const data = await filterData("ReportSectionbe61252ff04b6040833d");
  if (data) {
    await fetchData(data);

  }

}

function updateFilterValues(year, region, month, comparison) {

  yearSection = document.getElementById("yearValue")
  monthSection = document.getElementById("monthValue")
  dateSection = document.getElementById("regionValue")
  comparisonSection = document.getElementById("comparisonValue")

  yearSection.textContent = year[0]
  monthSection.textContent = month[0]
  dateSection.textContent = region
  comparisonSection.textContent = comparison[0]


}

async function fetchData(data) {
  // const data = await fetchVisualData(workspaceId, reportId, pagename) ;

  if (data) {
    // Process Cards
    if (data.Data.Cards) {
      data.Data.Cards.forEach(card => {
        try {
          createCard(card.Content, card.Title, card.visualId, card.DyamicValue, card.DynamicVariance, card.DynamicTitle, card.DynamicColor, card.SeriesData);
        } catch (error) {
          console.error(`Error creating card with ID ${card.visualId}:`, error);
        }
      });
    }

    if (data.Data.Slicer) {
      data.Data.Slicer.forEach(s => {
        try {
          if (s.Title === "Month Slicer") {
            localStorage.setItem("Month", s.SelectedValues);
          } else if (s.Title === "Year Slicer") {
            localStorage.setItem("Year", s.SelectedValues);
          }

          createDropdown(s.Title, s.Options, s.visualId, s.Id, s.TableName, s.ColumnName, s.SelectedValues);
        } catch (error) {
          console.error(`Error creating dropdown of type ${s.Type} with ID ${s.visualId}:`, error);
        }
      });
    }

    // Process Tables
    if (data.Data.Tables) {
      data.Data.Tables.forEach(table => {
        if (table.Type == "pivotTable") {
          try {
            createCohertTable(table.Title, table.Columns, table.Rows, table.visualId);
          } catch (error) {
            console.error(`Error creating chart of type ${table.Type} with ID ${table.visualId}:`, error);
          }
        }
        if (table.Type == "tableEx") {
          try {
            createTable(table.Title, table.Columns, table.Rows, table.visualId);
          } catch (error) {
            console.error(`Error creating chart of type ${table.Type} with ID ${table.visualId}:`, error);


          }
        }


      });
    }

    if (data.Data.AdvancedSlicer) {
      data.Data.AdvancedSlicer.forEach(advSlicer => {


        try {
          createAdvanceSlicer(advSlicer.Title, advSlicer.Options, advSlicer.visualId, advSlicer.Id, advSlicer.TableName, advSlicer.ColumnName, advSlicer.SlicerValue);
        } catch (error) {
          console.error(`Error creating chart of type ${advSlicer.Type} with ID ${advSlicer.visualId}:`, error);
        }
      });
    }

    // if (data.Data.FilterValues) {
    //   data.Data.FilterValues.forEach(value => {
    //     try{
    //       updateFilterValues(value.Year,value.Region,value.Month,value.Comparison)
    //     } catch (error) {
    //     console.error(`Error creating chart of type  with ID ${value}:`, error);
    //   }
    //   });
    // }

    if (data.Data.Charts) {
      data.Data.Charts.forEach(chart => {

        // if (chart.SeriesData.length >1 )  {
        //     config = generateChartConfig(chart.SeriesData)
        //     console.log(config,"dsfdjbgj")

        //   const myChart = new Chart(document.getElementById('chartCanvas'), config);
        // }


        if (chart.SeriesData.length === 1) {
          if (chart.Type === "areaChart") {
            try {
              createChart(chart.Title, chart.SeriesData[0].Xaxis, chart.SeriesData[0].Yaxis, chart.visualId, "line")
            } catch (error) {
              console.error(`Error creating chart of type ${chart.Type} with ID ${chart.visualId}:`, error);
            }
          }
          if (chart.Type === "clusteredColumnChart" || chart.Type === "clusteredBarChart" || chart.Type === "hundredPercentStackedColumnChart") {

            try {
              createChart(chart.Title, chart.SeriesData[0].Xaxis, chart.SeriesData[0].Yaxis, chart.visualId, "bar")
            } catch (error) {
              console.error(`Error creating chart of type ${chart.Type} with ID ${chart.visualId}:`, error);
            }
          }
          if (chart.Type === "funnel") {
            try {
              createChart(chart.Title, chart.SeriesData[0].Xaxis, chart.SeriesData[0].Yaxis, chart.visualId, "bar")
            } catch (error) {
              console.error(`Error creating chart of type ${chart.Type} with ID ${chart.visualId}:`, error);
            }
          }


          if (chart.Type === "donutChart") {
            try {
              createDonutChart(chart.Title, chart.SeriesData[0].Xaxis, chart.SeriesData[0].Yaxis, chart.visualId)
            } catch (error) {
              console.error(`Error creating chart of type ${chart.Type} with ID ${chart.visualId}:`, error);
            }
          }
        }
      });
    }
  }
}

function showLoader() {
  document.getElementById('loader').style.display = 'block';
  document.getElementById("wrapper").classList.add("blur");
}

function hideLoader() {
  document.getElementById('loader').style.display = 'none';
  document.getElementById("wrapper").classList.remove("blur");
}




function createCohertTable(Title, Columns, Rows, visualTable) {
  const tableContainer = document.getElementById(visualTable);

  // Clear any existing content in the container
  tableContainer.innerHTML = '';

  // Create and append the table title/header
  const maintableheader = document.createElement('div');
  maintableheader.className = "card-header";

  const tableheader = document.createElement('div');
  tableheader.className = "card-title";
  tableheader.innerHTML = Title;
  maintableheader.append(tableheader);
  tableContainer.append(maintableheader);

  // Create a scrollable container for the table
  const scrollableContainer = document.createElement('div');
  scrollableContainer.style.overflowX = 'auto'; // Enable horizontal scrolling
  scrollableContainer.style.width = '100%'; // Adjust width as needed
  scrollableContainer.className = 'table-scroll';

  // Create table element
  const table = document.createElement('table');
  table.setAttribute('id', 'retentionTable');

  // Create table header
  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');

  const dateHeader = document.createElement('th');
  dateHeader.innerText = 'Date';
  headerRow.appendChild(dateHeader);

  const cohortCountHeader = document.createElement('th');
  cohortCountHeader.innerText = 'Total';
  headerRow.appendChild(cohortCountHeader);

  // Determine the maximum number of values for dynamic column count
  const uniqueDateValues = Rows.reduce((acc, student) => {
    const date = student[0];
    let cohortCount = student[1]; // Ensure cohort count is a number

    cohortCount = Number(cohortCount.replace(/[^\d.-]/g, ''));

    if (!acc[date]) {
      acc[date] = {
        cohortCount: 0,
        values: []
      };
    }
    acc[date].cohortCount += cohortCount;
    acc[date].values.push(cohortCount);
    return acc;
  }, {});

  const maxValuesLength = Math.max(...Object.values(uniqueDateValues).map(val => val.values.length));

  // Create dynamic headers for each additional column
  Object.keys(uniqueDateValues).forEach(date => {
    const th = document.createElement('th');
    th.innerText = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });

    headerRow.appendChild(th);
  });

  thead.appendChild(headerRow);
  table.appendChild(thead);

  // Create table body
  const tbody = document.createElement('tbody');
  Object.entries(uniqueDateValues).forEach(([date, {
    cohortCount,
    values
  }]) => {
    const row = document.createElement('tr');

    // Insert Date cell
    const dateCell = document.createElement('td');
    dateCell.innerText = new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      year: 'numeric'
    });
    row.appendChild(dateCell);

    // Insert Cohort Count cell
    const cohortCountCell = document.createElement('td');
    cohortCountCell.innerText = cohortCount;
    row.appendChild(cohortCountCell);

    // Insert Value cells
    values.forEach(value => {
      const valueCell = document.createElement('td');
      valueCell.innerText = value;
      row.appendChild(valueCell);
    });

    // Add empty cells if values array is shorter than maxValuesLength
    for (let emptyIndex = 0; emptyIndex < maxValuesLength - values.length; emptyIndex++) {
      row.appendChild(document.createElement('td'));
    }

    tbody.appendChild(row);
  });

  table.appendChild(tbody);
  scrollableContainer.appendChild(table); // Append table to scrollable container
  tableContainer.appendChild(scrollableContainer); // Append scrollable container to the main container
};


// Visual Change  based on selected Button (Hide/Show)
function multipleVisualChanges(selectedIds, selectedButtonId, buttongroupName, allIds) {

  // Corrected selector with all IDs in a single string
  const newdivs = document.querySelectorAll(allIds);
  const buttons = document.querySelectorAll(`.${buttongroupName}`);
  buttons.forEach(button => {

  })


  // Hide all divs
  newdivs.forEach(div => {

    div.style.display = 'none';

  });

  // Show only the selected divs
  selectedIds.forEach(id => {
    const selectedDiv = document.getElementById(id);
    if (selectedDiv) {
      selectedDiv.style.display = 'block';
    }
  });

  buttons.forEach((button) => {
    button.classList.remove('active');
  });

  selectedButtonId.classList.add('active');
}


// Function to generate chart configuration
function generateChartConfig(seriesData) {

  // Extract labels and datasets from the data
  const labels = seriesData[0].Xaxis; // Use Xaxis from the first dataset

  const datasets = seriesData.map((series, index) => {
    const isLastDataset = index === seriesData.length - 1; // Check if it's the last dataset
    return {
      label: `Dataset ${index + 1}`,
      data: series.Yaxis,
      fill: !isLastDataset, // Only bar datasets will be filled
      backgroundColor: getRandomColor(),
      type: isLastDataset ? 'line' : 'bar', // Last dataset as line, others as bars
      borderColor: isLastDataset ? getRandomColor() : 'transparent', // Line border for last dataset only
      borderWidth: isLastDataset ? 2 : 0,
      tension: isLastDataset ? 0.4 : 0, // Smooth line for the last dataset only
      stack: !isLastDataset ? 'stack1' : undefined // Stack only for bar charts
    };
  });
  // Chart configuration object
  const chartConfig = {
    type: 'bar', // Overall chart type as 'bar' for stacked display
    data: {
      labels: labels,
      datasets: datasets
    },
    options: {
      responsive: true,
      // plugins: {
      //     title: {
      //         display: true,
      //         text: "jsonData.Title",
      //         font: {
      //             size: 18
      //         }
      //     },
      //     // legend: {
      //     //     position: 'top',
      //     //     labels: {
      //     //         font: {
      //     //             size: 12
      //     //         }
      //     //     }
      //     // }
      // },
      scales: {
        x: {
          stacked: true // Enable stacking on X-axis
        },
        y: {
          stacked: true, // Enable stacking on Y-axis for bar datasets
          ticks: {
            beginAtZero: true
          }
        }
      }
    }
  };

  return chartConfig;
}

// Helper function to generate random colors
function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}


async function DrillThroughFilter(xLabel, title) {
  try {

    let column = "";

    if (title === "New Bookings (#)" || title === "Closed Won ($)") {
      column = "Region"
    } else if (title === "ARR by Industry" || title === "MRR by Industry") {
      column = "Industry"
    } else if (title === "ARR vs Lead Source" || title === "MRR vs Lead Source") {
      column = "LeadSource"
    } else if (title === "ARR by AE Owner" || title === "MRR by AE Owner") {
      column = "AccountExecutiveName"
    } else if (title === "Cust.Count EOM by Year-Month" ) {
      column = "CustomerCount"
    }else {
      console.log("No Filtertaion API There..")
    }

    const year = localStorage.getItem("Year")
    const monthString = localStorage.getItem("Month")

    // Split the month string into an array by comma and trim any extra spaces
    const monthsList = monthString.split(",").map(month => month.trim());

    // Define the data to be sent in the request body
    const filterData = {
      Year: year, // Example year
      Month: monthsList, // Example months
      ColumnName: column, // Optional field
      ColumnValue: xLabel
    };


    // Make a POST request to the API endpoint
    const response = await fetch(`${baseURL}/api/v1/report/filterData/get`, {
      method: 'POST', // Specify the HTTP method
      headers: {
        'Content-Type': 'application/json', // Set the content type to JSON
      },
      body: JSON.stringify(filterData) // Convert the filter data to JSON
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // Parse the JSON response
    const data = await response.json();
    // Return the data
    return data;

  } catch (error) {
    // Handle any errors
    console.error('Error fetching visual data:', error);
  }
}


// Not in use 
function createCardSample(content, title, containerId, comparisonValue, variance, dynamicTitle, dynamicColor) {
  document.getElementById(containerId).textContent = ""
  iconClass = getIconForHeading(title)
  // Create the card structure
  const cardHTML = `
  <div class="card card-stats shadow-lg">
  <div class="card-body" style="height:100px">
    <div class="row align-items-center">
      <div class="col-4 text-center">
        <div class="icon-big text-success">
          <i class="${iconClass}" style="color:#5834db"></i>
        </div>
      </div>
      <div class="col-8">
        <div class="numbers">
          <p class="card-category text-center" style="font-size: 0.75rem; margin-left:-20px; color:black;">${title}</p>
          <h4 class="card-title text-center" style="font-weight: bold; margin-left:-20px;">${content}</h4>
        </div>
      </div>
       <div class="card-footer" style="padding: 0px 10px; background-color: white; border-top: 1px solid #ddd;">
    
        <div class="text-center" style="font-size: 0.75rem; word-spacing: 3px;">
         ${dynamicTitle} ${comparisonValue} <span style="color:${dynamicColor.toLowerCase() === 'light green' ? 'green' : dynamicColor};">${variance}</span>
        </div>      
       </div>
    </div>
   
  </div>
  <div  style=" width: 100%; padding: 3px;">
    <canvas id="${containerId}-chart" style="height: 50px; width: 100%;"></canvas>
  </div>
  
</div>

`;

  // Append the card to the card container
  document.getElementById(containerId).innerHTML += cardHTML;

  const chartCanvas = document.getElementById(`${containerId}-chart`).getContext('2d');
  const x = ["dbfdj", "dfhfd"]


  new Chart(chartCanvas, {
    type: "line",
    data: {
      labels: Array(10).fill(''), // Empty labels
      datasets: [{
        data: [10, 20, 15, 30, 25, 35, 20, 15, 30, 40], // Example data
        borderColor: 'blue', // Line color
        backgroundColor: 'rgba(88, 103, 221, 0.2)', // Fill color
        borderWidth: 1,
        pointRadius: 1, // No points
        tension: 0.01 // Smooth curve
      }]
    },
    options: {
      plugins: {
        legend: {
          display: false, // Hide the legend
        },
        title: {
          display: true,
          text: "",
          color: "#5834db",
          font: {
            size: 18 // Adjust the size as desired
          }
        },
        datalabels: x.length < 10 ? { // Apply datalabels only when there are fewer than 10 bars
          anchor: "end",
          align: "end",
          color: "#5834db",
          font: {
            weight: "bold",
          },
        } : false, // Disable datalabels if more than 10 bars


      },
      scales: {
        x: {
          grid: {
            display: false // Hide x-axis grid lines
          },
          ticks: {
            min: 0
          }
        },
        y: {
          grid: {
            display: false // Hide y-axis grid lines
          },
          ticks: {
            display: false, // Hide y-axis ticks (values)
          }
        }
      },
      // Add an onClick event in the chart optio
    }
  });

}