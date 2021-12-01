const dateRegex = new RegExp('^\\d\\d\\d\\d-\\d\\d-\\d\\d');

function jsonDateReviver(key, value) {
  if (dateRegex.test(value)) return new Date(value);
  return value;
}

async function graphQLFetch(query, variables = {}) {
    try {
      const response = await fetch('/graphql', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json'},
        body: JSON.stringify({ query, variables })
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

function User(props){
  const user=props.user;

  return(
    <form action="#" className="userdetail">
        <table align="center">
        <tr>
            <td class="left">Username: </td><td class="right">{user.username}</td>
        </tr>
        <tr>
            <td  class="left">Password: </td><td class="right">{user.password}</td>
        </tr>
        <tr>
            <td class="left">Email: </td><td class="right">{user.email}</td>
        </tr>
        <tr>
            <td class="left" >Name: </td><td class="right">{user.name}</td>
        </tr>
        <tr>
            <td class="left" >Phone: </td><td class="right">{user.phone}</td>
        </tr>
        <tr>
            <td class="left">Gender: </td><td class="right">{user.gender}</td>
        </tr>
        <tr>
            <td class="left">Person: </td><td class="right">{user.person}</td>
        </tr>
        </table>
    </form>
  );
}


function UserTable(props){
    const userrows=props.user.map(user=>
      <User key={user.id} user={user}/>
      );
  
    return (
      <div>
        <hr />
        {userrows}
      </div>
    );
    
  }

  function LoanRow(props) {
    const loan=props.loan
    return (
      <tr>
          <td>{loan.title}</td>
          <td>{loan.reader}</td>
          <td>{loan.loandate.toDateString()}</td>
          <td>{loan.returndate?loan.returndate.toDateString():""}</td>
      </tr>
    );
  }
  
  function LoanTable(props) {
    const loanRows = props.loans.map(loan =>
      <LoanRow key={loan.id} loan={loan} />
    );
  
    return (
      <table className="loan-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Reader</th>
              <th>Loan Date</th>
              <th>Return Date</th>
            </tr>
          </thead>
          <tbody>
            {loanRows}
          </tbody>
      </table>
    );
  }
  


class Userdetail extends React.Component {
    constructor() {
      super();
      this.state = { user: [] , loans: []};
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
        this.setState({ user: data.currentuser });
      }

      if(data){
        const username= data.currentuser[0].username
        console.log(username)
        this.displayLoan(username)
    }
  }


    async displayLoan(username){
        
        const query = `query displayLoan($username: String!) {
          displayLoan(username: $username){
            id reader title loandate returndate
          }
            
        }`;

        const data = await graphQLFetch(query,{username});
        if (data){
          const result = data.displayLoan
          this.setState({ loans: result });
          
        }
      
    }

    handleOut(){
      window.location.href = "usersetting.html";
    }
  
  
    render() {
      return (
        <React.Fragment>
          <hr />
          <h2 style={{width:"100%","text-align":"center"}}>Student Info</h2>
          <UserTable user={this.state.user} />
          <br />
          <div onClick={this.handleOut} style={{width:"100%","text-align":"center"}}><button>Edit</button></div>
          <br />
          <hr />
          <h2 style={{width:"100%","text-align":"center"}}>Student Borrowbook</h2>
          <hr />
          <LoanTable loans={this.state.loans} />
        </React.Fragment>
      );
    }
  }
  
  const element = <Userdetail />;
  
  ReactDOM.render(element, document.getElementById('userdetail'));

