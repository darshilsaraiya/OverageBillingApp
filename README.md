# OverageBillingApp
Calculates the overage, generate bills and sends them to the customers

## Segment Application Engineer
### System Flow:
* **Finance user** will have DRAFT bills in a table. This user can `Approve` the bill. So, the bill will have the status `APPROVE_FINANCE`. Only those customers’ drafts will be generated which has `requireCSMapproval` equals to value `1` from table `customers`, the values of `billGenerated` equals to `0` and `startDate` of subscription is greater than `3 Months`. After the Draft is generated from the `usages` table, the value of `billGenerated` changes from `0` to `1`. And, the bill is then stored in `bill` table.
* **CustomerSuccess** user will only have access to those bills with the status `APPROVE_FINANCE`. As per the requirements, this user can either Approve or Reject(Waive) any bills approved by the Finance user. After approving the bill, it will have the status `APPROVE_CUSTOMERSUCCESS`.
* **Sales user** will only have access to those bills with the status `APPROVE_CUSTOMERSUCCESS`. Like CustomerSuccess user, this user can either Approve or Reject(Waive) any bills approved by the CustomerSucces user. After approving the bill, it will have the status `FINAL`.
* After the approval by Sales user, Finance User can see the list of these bills. This user can send the bill to the customer. The table which keeps track of bills gets updated and the status is changed from `FINAL` to `SENT`. And, the server also send the JSON response of this `SENT` bill to the given URI.
* To login into the system, use `/login`.
* Contents of a final bill (Example):
```
{
    "sender_email":"sdarshil22@gmail.com",
    "bill":
    [
        {
            "billID":3,
            "customerID":2,
            "customerName":"customer2",
            "billingAddress":"2 appian way, Redmond , Washington",
            "billingEmail":"ap@customer2.com",
            "month":6,
            "year":2016,
            "monthlyapiLimit":200000,
            "overageUnits":500000,
            "overageUnitPrice":0.09,
            "overageAmount":45000,
            "startDate":"2016-02-01T08:00:00.000Z"
          }
    ]
}
```

### Database Schema:
* Schema
```
CREATE SCHEMA ‘segment’ ;
```

* customers
```
CREATE TABLE 'segment'.'customers' (
  'customerID' INT NOT NULL AUTO_INCREMENT,
  'customerName' VARCHAR(255) NOT NULL,
  'billingAddress' VARCHAR(255) NOT NULL,
  'billingEmail' VARCHAR(127) NOT NULL,
  'monthlyapiLimit' INT NOT NULL,
  'overageUnitCost' FLOAT NOT NULL,
  'startdate' DATE NOT NULL,
  'enddate' DATE,
  'requireCSMapproval' TINYINT(1) NOT NULL,
  PRIMARY KEY ('customerID'))AUTO_INCREMENT=1;
```

* stakeholders
```
CREATE TABLE ‘segment’.’stakeholders’ (
  ‘userID' INT NOT NULL AUTO_INCREMENT,
  ‘username' VARCHAR(255) NOT NULL,
  ‘role’ VARCHAR(100) NOT NULL,
  ‘password’ VARCHAR(255) NOT NULL,
  PRIMARY KEY (‘userID’))AUTO_INCREMENT=1;
```

* usages
```
CREATE TABLE ‘segment’.’usages’ (
  ‘usageID’ INT NOT NULL AUTO_INCREMENT,
  ‘customerID’ INT NOT NULL,
  ‘month’ INT NOT NULLSegment Application Engineer
```

* bill
```
CREATE TABLE 'segment'.'bill' (
  'billID' INT NOT NULL AUTO_INCREMENT,
  ‘usageID’ INT NOT NULL,
  'customerID' INT NOT NULL,
  'month' INT NOT NULL,
  'year' INT NOT NULL,
  'status' VARCHAR(128) NOT NULL,
  'overageUnits' INT NOT NULL,
  'overageUnitPrice' FLOAT NOT NULL,
  'overageAmount' FLOAT NOT NULL,
  'generatedTimestamp' TIMESTAMP NOT NULL DEFAULT 0,
  'updatedTimestamp' TIMESTAMP NOT NULL DEFAULT 0,
  PRIMARY KEY ('billID'),
  FOREIGN KEY ('customerID') REFERENCES 'segment'.'customers'('customerID'),
  FOREIGN KEY ('usageID') REFERENCES 'segment'.'usages'('usageID')
)AUTO_INCREMENT=1;
```

### Application Technologies

* **UI:** HTML, CSS, Bootstrap
* **Front-end:** AngluarJS
* **Application Server:** NodeJs with Express Framework
* **Database:** MySQL


### Steps and Requirements to Run the Application:
  
* The machine must have NodeJS and NPM installed.
* Go to the application `OverageBillingApp` directory and run `npm install` command from the command line. All the dependencies in the `package.json` will be installed under the `node_modules` folder.
* The machine must have MySQL server installed. Run MySQL server.
* To run the application, go to `OverageBillingApp/bin` directory and run `node www` command from the command line.
