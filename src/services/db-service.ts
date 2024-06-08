import {
  SQLiteDatabase,
  enablePromise,
  openDatabase,
} from 'react-native-sqlite-storage';

enablePromise(true);

export const connectToDatabase = async () => {
  return openDatabase(
    {name: 'vsgmobile.db', location: 'default'},
    () => {},
    error => {
      console.error('error ::: ', error);
      throw Error('Could not connect to database');
    },
  );
};

export const createCustomerTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS customers (
        Add1 TEXT,
        Add2 TEXT,
        Add3 TEXT,
        CreditLimit INTEGER,
        CusId TEXT PRIMARY KEY,
        CustomerName TEXT,
        EmailAddress TEXT,
        Status TEXT,
        TeleNo1 TEXT,
        TeleNo2 TEXT,
        TransactionTime TEXT
      );`,
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Failed to create table:', error);
      },
    );
  });
};

export const createItemsTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS items (
         BarCode TEXT,
         ItemCode TEXT PRIMARY KEY,
         ItemCode_Index INTEGER,
         ItemMeasure TEXT,
         ItemName TEXT,
         ItemStatus TEXT
       );`,
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Failed to create table:', error);
      },
    );
  });
};

export const createItemsGrnTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS items_grn (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         DeviceUpdatedTime TEXT,
         Grn_Index INTEGER,
         ItemCode TEXT,
         Quantity INTEGER,
         RepId TEXT,
         SockId TEXT,
         StkTransferId TEXT,
         TransactionTime TEXT
       );`,
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Failed to create table:', error);
      },
    );
  });
};

export const createItemsPricesTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS items_prices (
         id INTEGER PRIMARY KEY AUTOINCREMENT,
         CusId TEXT,
         ItemCode TEXT,
         ItemCost REAL,
         ItemLabelPrice REAL,
         PriceId TEXT,
         PriceId_Index INTEGER,
         SalePrice REAL,
         Status TEXT,
         StockId TEXT,
         TransactionTime TEXT
       );`,
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      error => {
        console.error('Failed to create table:', error);
      },
    );
  });
};

export const createSalesRepsTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS sales_reps (
        CreateDate TEXT,
        RepId TEXT PRIMARY KEY,
        RepName TEXT,
        Status TEXT
      )`,
      [],
      (tx, results) => {
        console.log('Table created successfully');
      },
      error => {
        console.log('Error: ', error);
      },
    );
  });
};

export const createInvoicesTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS invoices (
        InvoNo INTEGER PRIMARY KEY AUTOINCREMENT,
        InvoType TEXT,
        InvoDate TEXT,
        CusId TEXT,
        RepId TEXT,
        InvoMode TEXT,
        InvoCost TEXT,
        InvoLabelPriceTotal TEXT,
        ItemDiscount TEXT,
        InvoSalePriceTotal TEXT,
        InvoDiscount TEXT,
        InvoNetTotal TEXT,
        TotalPayment TEXT,
        CreditBalance TEXT,
        PreOustanding TEXT,
        IsReturn TEXT,
        ReturnInvoNo TEXT,
        InvDetails TEXT,
        TransactionTime TEXT
      )`,
      [],
      (tx, result) => {
        console.log('Invoices table created successfully');
      },
      error => {
        console.error('Failed to create invoices table:', error);
      },
    );
  });
};

export const createInvoiceDetailsTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS invoice_details (
        InvoiceDetails_Index INTEGER PRIMARY KEY AUTOINCREMENT,
        InvoNo TEXT,
        ItemCode TEXT,
        ItemLabelPrice TEXT,
        ItemSaleDiscount TEXT,
        DiscountedPrice TEXT,
        ItemQuantity TEXT,
        ItemNetTotal TEXT,
        ItemCost TEXT,
        ItemCostValue TEXT,
        StockId TEXT,
        ItemSoldType TEXT,
        ItemSoldAs TEXT,
        TransactionTime TEXT
      )`,
      [],
      (tx, result) => {
        console.log('Invoice details table created successfully');
      },
      error => {
        console.error('Failed to create invoice details table:', error);
      },
    );
  });
};

export const createInvoicePaymentsTable = (db: SQLiteDatabase) => {
  db.transaction(tx => {
    tx.executeSql(
      `CREATE TABLE IF NOT EXISTS invoice_payments (
        InvoPayTransac INTEGER PRIMARY KEY AUTOINCREMENT,
        InvoNo TEXT,
        InvoiceDate TEXT,
        PaidAmount TEXT,
        PaymentMode TEXT,
        ReferenceNo TEXT,
        BankCodes TEXT,
        CashDepositAcctNo TEXT,
        UserId TEXT,
        PaymentStatus TEXT,
        TransacStatus TEXT,
        PaidSequence TEXT,
        TransactionTime TEXT
      )`,
      [],
      (tx, result) => {
        console.log('Invoice payments table created successfully');
      },
      error => {
        console.error('Failed to create invoice payments table:', error);
      },
    );
  });
};

export const insertCustomers = (db: SQLiteDatabase, customers: any[]) => {
  if (customers.length === 0) {
    return;
  }
  const values = customers
    .map(
      customer =>
        `(
      "${customer.Add1}",
      "${customer.Add2}",
      "${customer.Add3}",
      ${customer.CreditLimit},
      "${customer.CusId}",
      "${customer.CustomerName}",
      "${customer.EmailAddress}",
      "${customer.Status}",
      "${customer.TeleNo1}",
      "${customer.TeleNo2}",
      "${customer.TransactionTime}"
    )`,
    )
    .join(', ');

  const sql = `
    INSERT INTO customers (
      Add1, Add2, Add3, CreditLimit, CusId, CustomerName, EmailAddress, Status, TeleNo1, TeleNo2, TransactionTime
    ) VALUES ${values};
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (tx, results) => {
        console.log('Customers inserted successfully');
      },
      error => {
        console.error('Failed to insert customers:', error);
      },
    );
  });
};

export const insertItems = (db: SQLiteDatabase, items: any[]) => {
  if (items.length === 0) {
    return;
  }

  const values = items
    .map(
      item =>
        `(
      "${item.BarCode}",
      "${item.ItemCode}",
      ${item.ItemCode_Index},
      "${item.ItemMeasure}",
      "${item.ItemName}",
      "${item.ItemStatus}"
    )`,
    )
    .join(', ');

  const sql = `
    INSERT INTO items (
      BarCode, ItemCode, ItemCode_Index, ItemMeasure, ItemName, ItemStatus
    ) VALUES ${values};
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (tx, results) => {
        console.log('Items inserted successfully');
      },
      error => {
        console.error('Failed to insert items:', error);
      },
    );
  });
};

export const insertItemsGrn = (db: SQLiteDatabase, itemsGrn: any[]) => {
  if (itemsGrn.length === 0) {
    return;
  }

  const values = itemsGrn
    .map(
      item =>
        `(
      ${item.DeviceUpdatedTime ? `"${item.DeviceUpdatedTime}"` : 'NULL'},
      ${item.Grn_Index},
      "${item.ItemCode}",
      ${item.Quantity},
      "${item.RepId}",
      "${item.SockId}",
      "${item.StkTransferId}",
      "${item.TransactionTime}"
    )`,
    )
    .join(', ');

  const sql = `
    INSERT INTO items_grn (
      DeviceUpdatedTime, Grn_Index, ItemCode, Quantity, RepId, SockId, StkTransferId, TransactionTime
    ) VALUES ${values};
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (tx, results) => {
        console.log('Items GRN inserted successfully');
      },
      error => {
        console.error('Failed to insert items GRN:', error);
      },
    );
  });
};

export const insertItemsPrices = (db: SQLiteDatabase, itemsPrices: any[]) => {
  if (itemsPrices.length === 0) {
    return;
  }

  const values = itemsPrices
    .map(
      item =>
        `(
      "${item.CusId}",
      "${item.ItemCode}",
      ${item.ItemCost},
      ${item.ItemLabelPrice},
      "${item.PriceId}",
      ${item.PriceId_Index},
      ${item.SalePrice},
      "${item.Status}",
      "${item.StockId}",
      "${item.TransactionTime}"
    )`,
    )
    .join(', ');

  const sql = `
    INSERT INTO items_prices (
      CusId, ItemCode, ItemCost, ItemLabelPrice, PriceId, PriceId_Index, SalePrice, Status, StockId, TransactionTime
    ) VALUES ${values};
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (tx, results) => {
        console.log('Items prices inserted successfully');
      },
      error => {
        console.error('Failed to insert items prices:', error);
      },
    );
  });
};

export const insertSalesReps = (db: SQLiteDatabase, salesReps: any[]) => {
  if (salesReps.length === 0) {
    return;
  }

  const values = salesReps
    .map(
      rep =>
        `(
      "${rep.CreateDate}",
      "${rep.RepId}",
      "${rep.RepName}",
      "${rep.Status}"
    )`,
    )
    .join(', ');

  const sql = `
    INSERT INTO sales_reps (
      CreateDate, RepId, RepName, Status
    ) VALUES ${values};
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [],
      (tx, results) => {
        console.log('Sales reps inserted successfully');
      },
      error => {
        console.error('Failed to insert sales reps:', error);
      },
    );
  });
};

export const insertInvoice = (
  db: SQLiteDatabase,
  invoice: {
    InvoType: string;
    InvoDate: string;
    CusId: string;
    RepId: string;
    InvoMode: string;
    InvoCost: string;
    InvoLabelPriceTotal: string;
    ItemDiscount: string;
    InvoSalePriceTotal: string;
    InvoDiscount: string;
    InvoNetTotal: string;
    TotalPayment: string;
    CreditBalance: string;
    PreOustanding: string;
    IsReturn: string;
    ReturnInvoNo: string;
    InvDetails: string;
    TransactionTime: string;
  },
) => {
  const {
    InvoType,
    InvoDate,
    CusId,
    RepId,
    InvoMode,
    InvoCost,
    InvoLabelPriceTotal,
    ItemDiscount,
    InvoSalePriceTotal,
    InvoDiscount,
    InvoNetTotal,
    TotalPayment,
    CreditBalance,
    PreOustanding,
    IsReturn,
    ReturnInvoNo,
    InvDetails,
    TransactionTime,
  } = invoice;

  const sql = `
    INSERT INTO invoices (
      InvoType,
      InvoDate,
      CusId,
      RepId,
      InvoMode,
      InvoCost,
      InvoLabelPriceTotal,
      ItemDiscount,
      InvoSalePriceTotal,
      InvoDiscount,
      InvoNetTotal,
      TotalPayment,
      CreditBalance,
      PreOustanding,
      IsReturn,
      ReturnInvoNo,
      InvDetails,
      TransactionTime
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);
  `;

  db.transaction(tx => {
    tx.executeSql(
      sql,
      [
        InvoType,
        InvoDate,
        CusId,
        RepId,
        InvoMode,
        InvoCost,
        InvoLabelPriceTotal,
        ItemDiscount,
        InvoSalePriceTotal,
        InvoDiscount,
        InvoNetTotal,
        TotalPayment,
        CreditBalance,
        PreOustanding,
        IsReturn,
        ReturnInvoNo,
        InvDetails,
        TransactionTime,
      ],
      (tx, results) => {
        console.log('Invoice inserted successfully');
      },
      error => {
        console.error('Failed to insert invoice:', error);
      },
    );
  });
};
export const getCustomersList = (db: SQLiteDatabase) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT CusId, CustomerName FROM customers;',
        [],
        (tx, results) => {
          const rows = results.rows.raw();
          const customerList = rows.map(row => ({
            label: row.CustomerName,
            value: row.CusId,
          }));
          resolve(customerList);
        },
        (tx, error) => {
          console.error('Failed to fetch customers:', error);
          reject(error);
        },
      );
    });
  });
};

export const getItemsList = (db: SQLiteDatabase) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT ItemName, ItemCode FROM items;',
        [],
        (tx, results) => {
          const rows = results.rows.raw();
          const itemsList = rows.map(row => ({
            label: row.ItemName,
            value: row.ItemCode,
          }));
          resolve(itemsList);
        },
        (tx, error) => {
          console.error('Failed to fetch items:', error);
          reject(error);
        },
      );
    });
  });
};

export const getItemsGrnListByItemCodeandRepId = (
  db: SQLiteDatabase,
  itemCode: string,
  repId: string,
) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM items_grn WHERE ItemCode = ? AND RepId = ?;',
        [itemCode, repId],
        (tx, results) => {
          const rows = results.rows.raw();
          resolve(rows);
        },
        (tx, error) => {
          console.error('Failed to fetch items:', error);
          reject(error);
        },
      );
    });
  });
};

export const checkRepIdExists = (db: SQLiteDatabase, repId: String) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        `SELECT * FROM sales_reps WHERE RepId = ?`,
        [repId],
        (tx, results) => {
          if (results.rows.length > 0) {
            resolve(true);
          } else {
            resolve(false);
          }
        },
        error => {
          console.error('Failed to check RepId:', error);
          reject(error);
        },
      );
    });
  });
};

export const getItemsByStockIdandCusId = (
  db: SQLiteDatabase,
  sockId: string,
  cusId: string,
) => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM items_prices WHERE StockId = ? AND CusId = ?;',
        [sockId, cusId],
        (tx, results) => {
          const rows = results.rows.raw();
          resolve(rows);
        },
        (tx, error) => {
          console.error('Failed to fetch items:', error);
          reject(error);
        },
      );
    });
  });
};

export const getAllInvoices = (db: SQLiteDatabase): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    db.transaction(tx => {
      tx.executeSql(
        'SELECT * FROM invoices',
        [],
        (tx, results) => {
          let invoices = [];
          for (let i = 0; i < results.rows.length; i++) {
            invoices.push(results.rows.item(i));
          }
          resolve(invoices);
        },
        error => {
          console.error('Failed to retrieve invoices:', error);
          reject(error);
        },
      );
    });
  });
};

export const deleteInvoiceById = (db: SQLiteDatabase, invoiceId: number) => {
  return new Promise<void>((resolve, reject) => {
    db.transaction(
      tx => {
        tx.executeSql(
          'DELETE FROM invoices WHERE InvoNo = ?',
          [invoiceId],
          (tx, results) => {
            if (results.rowsAffected > 0) {
              resolve();
            } else {
              reject(new Error('Invoice not found'));
            }
          },
          (tx, error) => {
            reject(error);
          },
        );
      },
      error => {
        reject(error);
      },
    );
  });
};
