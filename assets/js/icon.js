const icons = {
    "ARR": {
      "icon": "fa fa-dollar-sign"
    },
    "MRR": {
      "icon": "fa fa-chart-line"
    },
    "New Bookings": {
      "icon": "fa fa-calendar-plus"
    },
    "Expansions": {
      "icon": "fa fa-arrow-up"
    },
    "Customers": {
      "icon": "fa fa-users"
    },
    "Logo Churn": {
      "icon": "fa fa-times-circle"
    },
    "Conversion %": {
      "icon": "fa fa-percentage"
    },
    "Avg. ACV/ARPU": {
      "icon": "fa fa-money-bill-wave"
    },
    "Gross Dollar Retention": {
      "icon": "fa fa-chart-bar"
    },
    "Net Dollar Retention": {
      "icon": "fa fa-chart-line"
    },
    "Customer Acquisition Cost (CAC)": {
      "icon": "fa fa-wallet"
    },
    "Customer Lifetime Value (CLV)": {
      "icon": "fa fa-hourglass"
    },
    "CLV to CAC Ratio": {
      "icon": "fa fa-balance-scale"
    },
    "Payback Period (In Months)": {
      "icon": "fa fa-calendar-alt"
    },
        "Avg. Deal Size": {
          "icon": "fa fa-handshake"
        },
        "Open Pipeline": {
          "icon": "fa fa-chart-bar"
        },
        "Opp. Created in Last 30 Days": {
          "icon": "fa fa-clock"
        },
        "Avg. Opp. Length": {
          "icon": "fa fa-ruler"
        },
        "Gross Margin": {
          "icon": "fa fa-percentage"
        },
        "Gross Dollar Retention": {
          "icon": "fa fa-chart-line"
        },
        "Sales/Marketing as % of Rev": {
          "icon": "fa fa-bullhorn"
        },
        "CLV to CAC Ratio": {
          "icon": "fa fa-balance-scale"
        },
        "New Booking Growth": {
          "icon": "fa fa-chart-line"
        },
        "Net Dollar Retention": {
          "icon": "fa fa-chart-pie"
        },
        "G&A as % of Rev": {
          "icon": "fa fa-percent"
        },
        "Payback Period": {
          "icon": "fa fa-calendar-alt"
        },
        "New Logo Growth": {
          "icon": "fa fa-rocket"
        },
        "Gross Logo Retention": {
          "icon": "fa fa-check-circle"
        },
        "R&D as % of Rev": {
          "icon": "fa fa-flask"
        },
        "Roce Metric": {
          "icon": "fa fa-dollar-sign"
        },
        "ARPU": {
          "icon": "fa fa-money-bill-wave"
        },
        "EBITDA": {
          "icon": "fa fa-chart-area"
        },
        "Rule of 40": {
          "icon": "fa fa-calculator"
        }
      
      
  }
  
  
  function getIconForHeading(heading) {
    // Check if the heading exists in the icons object
    if (icons[heading]) {
      return icons[heading].icon;
    } else {
      return "fa fa-question-circle"; // Default icon if heading is not found
    }
  }
  
  