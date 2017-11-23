import React, { Component } from 'react';
import checkBalance from './check-balance';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import TextField from 'material-ui/TextField';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  onSubmit = async () => {
    this.setState({
      loading: true
    })
    const balance = await checkBalance(this.state.address);
    this.setState({
      balance,
      loading: false,
    });
  };

  render() {
    return (
      <MuiThemeProvider>
        <div style={{ paddingLeft: 10, paddingTop: 149 }}>
          <a href="https://github.com/someone235/btc-forks-balance"><img style={{ position: 'absolute', top: 0, left: 0, border: 0 }} src="https://camo.githubusercontent.com/567c3a48d796e2fc06ea80409cc9dd82bf714434/68747470733a2f2f73332e616d617a6f6e6177732e636f6d2f6769746875622f726962626f6e732f666f726b6d655f6c6566745f6461726b626c75655f3132313632312e706e67" alt="Fork me on GitHub" data-canonical-src="https://s3.amazonaws.com/github/ribbons/forkme_left_darkblue_121621.png" /></a>
          <div>
            <TextField
              hintText="BTC Address"
              onChange={e => this.setState({ address: e.target.value })}
              style={{ margin: 5, width: 350 }}
            />
            <RaisedButton onClick={this.onSubmit} primary={true} label="Check" disabled={this.state.loading} />
          </div>
          {this.getBalancesTable()}
        </div>
      </MuiThemeProvider>
    );
  }
  getBalancesTable() {
    if (this.state.balance) {
      const { totalBtc, totalUsd } = this.getTotal();
      return (
        <Table>
          <TableHeader adjustForCheckbox={false} displaySelectAll={false}>
            <TableRow>
              <TableHeaderColumn>Ticker</TableHeaderColumn>
              <TableHeaderColumn>Balance</TableHeaderColumn>
              <TableHeaderColumn>BTC Balance</TableHeaderColumn>
              <TableHeaderColumn>USD Balance</TableHeaderColumn>
            </TableRow>
          </TableHeader>
          <TableBody displayRowCheckbox={false}>
            <TableRow>
              <TableRowColumn><b>Total</b></TableRowColumn>
              <TableRowColumn></TableRowColumn>
              <TableRowColumn><b>{totalBtc / 1e8}</b></TableRowColumn>
              <TableRowColumn><b>{totalUsd}</b></TableRowColumn>
            </TableRow>
            {this.state.balance.map((currency, i) => {
              return (
                <TableRow key={currency.ticker}>
                  <TableRowColumn><a href={`https://coinmarketcap.com/currencies/${currency.cmcName}/`}>{currency.ticker}</a></TableRowColumn>
                  <TableRowColumn>{currency.balance / 1e8}</TableRowColumn>
                  <TableRowColumn>{currency.priceBtc * currency.balance / 1e8}</TableRowColumn>
                  <TableRowColumn>{currency.priceUsd * currency.balance / 1e8}</TableRowColumn>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      );
    }
  }
  getTotalBtc() {
    return this.state.balance.reduce((sum, currency) => sum + currency.balance * currency.priceBtc, 0);
  }
  getTotal() {
    const totalBtc = this.getTotalBtc();
    const btc = this.state.balance[0];
    const totalUsd = totalBtc * btc.priceUsd / 1e8;
    return { totalBtc, totalUsd };
  }
}

export default App;