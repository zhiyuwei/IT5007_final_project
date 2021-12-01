const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
  try {
    const response = await fetch('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query,
        variables
      })
    });
    const body = await response.text();
    const result = JSON.parse(body, jsonDateReviver);

    if (result.errors) {
      const error = result.errors[0];

      if (error.extensions.code == 'BAD_USER_INPUT') {
        alert(`${error.message}`);
      } else {
        alert(`${error.extensions.code}: ${error.message}`);
      }
    }

    return result.data;
  } catch (e) {
    alert(`Error in sending data to server: ${e.message}`);
  }
}

function User(props) {
  const user = props.user;
  return /*#__PURE__*/React.createElement("form", {
    action: "#",
    className: "userdetail"
  }, /*#__PURE__*/React.createElement("table", {
    align: "center"
  }, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Username: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.username)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Password: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.password)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Email: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.email)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Name: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.name)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Phone: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.phone)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Gender: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.gender)), /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", {
    class: "left"
  }, "Person: "), /*#__PURE__*/React.createElement("td", {
    class: "right"
  }, user.person))));
}

function UserTable(props) {
  const userrows = props.user.map(user => /*#__PURE__*/React.createElement(User, {
    key: user.id,
    user: user
  }));
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("hr", null), userrows);
}

function LoanRow(props) {
  const loan = props.loan;
  return /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("td", null, loan.title), /*#__PURE__*/React.createElement("td", null, loan.reader), /*#__PURE__*/React.createElement("td", null, loan.loandate.toDateString()), /*#__PURE__*/React.createElement("td", null, loan.returndate ? loan.returndate.toDateString() : ""));
}

function LoanTable(props) {
  const loanRows = props.loans.map(loan => /*#__PURE__*/React.createElement(LoanRow, {
    key: loan.id,
    loan: loan
  }));
  return /*#__PURE__*/React.createElement("table", {
    className: "loan-table"
  }, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", null, "Title"), /*#__PURE__*/React.createElement("th", null, "Reader"), /*#__PURE__*/React.createElement("th", null, "Loan Date"), /*#__PURE__*/React.createElement("th", null, "Return Date"))), /*#__PURE__*/React.createElement("tbody", null, loanRows));
}

class Userdetail extends React.Component {
  constructor() {
    super();
    this.state = {
      user: [],
      loans: []
    };
  }

  componentDidMount() {
    this.loadData();
  }

  async loadData() {
    const query = `query {
        currentuser {
          id username password name phone email gender person
        }
      }`;
    const data = await graphQLFetch(query);

    if (data) {
      this.setState({
        user: data.currentuser
      });
    }

    if (data) {
      const username = data.currentuser[0].username;
      console.log(username);
      this.displayLoan(username);
    }
  }

  async displayLoan(username) {
    const query = `query displayLoan($username: String!) {
          displayLoan(username: $username){
            id reader title loandate returndate
          }
            
        }`;
    const data = await graphQLFetch(query, {
      username
    });

    if (data) {
      const result = data.displayLoan;
      this.setState({
        loans: result
      });
    }
  }

  handleOut() {
    window.location.href = "usersetting.html";
  }

  render() {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h2", {
      style: {
        width: "100%",
        "text-align": "center"
      }
    }, "Student Info"), /*#__PURE__*/React.createElement(UserTable, {
      user: this.state.user
    }), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("div", {
      onClick: this.handleOut,
      style: {
        width: "100%",
        "text-align": "center"
      }
    }, /*#__PURE__*/React.createElement("button", null, "Edit")), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement("h2", {
      style: {
        width: "100%",
        "text-align": "center"
      }
    }, "Student Borrowbook"), /*#__PURE__*/React.createElement("hr", null), /*#__PURE__*/React.createElement(LoanTable, {
      loans: this.state.loans
    }));
  }

}

const element = /*#__PURE__*/React.createElement(Userdetail, null);
ReactDOM.render(element, document.getElementById('userdetail'));