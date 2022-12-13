let dataTable;

// dataTable column index
const COLUMN = {
  'NFT': 0,
  'NAME': 1,
  'RESOURCE': 2,
  'AMOUNT': 3,
  'EXPLORE': 4,
  'UPGRADE': 5
};

// filter
let nameFilterButton;
let nameFilterItemList;
let numberFilterButton;
let numberFilterItemList;
let resourceFilterButton;
let amountFilterButton;


function main() {
  // initialize dataTable
  dataTable = $('#nftlist').DataTable({
    order: [[1,'asc']],
    pageLength: 50,
    columns :[
      null,
      null,
      null,
      null,
      null,
      {searchable: false}
    ],
  });

  // get filter object
  nameFilterButton = $('#nftListFilterName');
  nameFilterItemList = $('#nftListFilterNameList');
  numberFilterButton = $('#nftListFilterNumber');
  numberFilterItemList = $('#nftListFilterNumberList');
  resourceFilterButton = $('[id^="nftListFilterResource"]');
  amountFilterButton = $('[id^="nftListFilterAmount"]');

  setupNameFilter();

  setupResourceFilter();

  setupAmountFilter();
}


function setupNameFilter() {
  // parse Name column
  // -> [{nftName: 'A Basic Oven #1', nftId: 'nft1...'}, ...]
  const nameCellList = Array.from(dataTable.column(COLUMN.NAME).data());
  const parsedNameCellList = nameCellList.map(parseNameCell);

  // split NFT name
  // ['A Basic Oven #1', ...] -> [{name: 'A Basic Oven', number: 1}, ...]
  const splitNftNameList = parsedNameCellList.map(e => e.nftName).map(splitNumber);

  // get unique name list
  // -> ['A Basic Oven', 'An Armed Bear', ...]
  const nameList = Array.from(new Set(splitNftNameList.map(e => e.name)));
  nameList.sort();

  // get number list group by name
  // -> [{name: 'A Basic Oven', numberList: [1, 2, 3, 4, 5]}, ...]
  const numberListGroupByName = nameList.map(name => {
    const numberListTemp = splitNftNameList.filter(e => e.name === name).map(e => e.number);
    // remove duplicate
    const numberList = Array.from(new Set(numberListTemp));
    numberList.sort((a, b) => a - b);
    // remove splitNumber() default number '-1'
    const index = numberList.indexOf(-1);
    if (index !== -1) {
      numberList.splice(index, 1);
    }

    return {
      'name': name,
      'numberList': numberList
    };
  });

  // add name dropdown item
  const nameFilterItemListElement = nameList.map(getDropdownItemElement);
  nameFilterItemList.append(nameFilterItemListElement);

  // add name filter event handler
  nameFilterItemList.on('click', 'li a', function() {
    const selectedName = $(this).text();
    nameFilterButton.text(selectedName);

    // reset number dropdown
    numberFilterButton.text('#');
    numberFilterItemList.empty();
    numberFilterItemList.append(getDropdownItemElement('#'));

    let filterCondition;
    if (selectedName === 'All') {
      filterCondition = '';
    }
    else {
      filterCondition = `^\\s+${selectedName}`;

      // add number dropdown item
      const numberList = numberListGroupByName.filter(e => e.name === selectedName)[0].numberList;
      const numberFilterItemListElement = numberList.map(getDropdownItemElement);
      numberFilterItemList.append(numberFilterItemListElement);
    }
    filterDataTableColumn(COLUMN.NAME, filterCondition);
  });

  // add number filter event handler
  numberFilterItemList.on('click', 'li a', function() {
    const selectedNumber = $(this).text();
    numberFilterButton.text(selectedNumber);

    // get selected name
    const selectedName = nameFilterButton.text();

    let filterCondition;
    if (selectedName === 'All') {
      filterCondition = '';
    }
    else {
      if (selectedNumber === '#') {
        filterCondition = `^\\s+${selectedName}`;
      }
      else {
        filterCondition = `^\\s+${selectedName} #${selectedNumber}\\D+`;
      }
    }
    filterDataTableColumn(COLUMN.NAME, filterCondition);
  });
}


function setupResourceFilter() {
  // add resource filter event handler
  resourceFilterButton.on('change', () => {
    const filterCondition = Array.from(resourceFilterButton)
      .filter(e => $(e).prop('checked'))
      .map(e => `^${ $(e).val() }$`)
      .join('|');
    
    filterDataTableColumn(COLUMN.RESOURCE, filterCondition);
  });
}


function setupAmountFilter() {
  // add amount filter event handler
  amountFilterButton.on('change', () => {
    const filterCondition = Array.from(amountFilterButton)
      .filter(e => $(e).prop('checked'))
      .map(e => `^${ $(e).val() }$`)
      .join('|');
    
    filterDataTableColumn(COLUMN.AMOUNT, filterCondition);
  });
}


// parse HTML from Name cell string
// HTML string -> {nftName: 'A Basic Oven #1', nftId: 'nft1...'}
function parseNameCell(cell) {
  const doc = new DOMParser().parseFromString(cell, 'text/html');
  const rows = doc.documentElement.getElementsByClassName('row');
  const nftName = rows[0].textContent.trim();
  const nftId = rows[1].textContent.trim();

  return {
    'nftName': nftName,
    'nftId': nftId
  };
}


// split NFT name into name and number
// NFT name = name + number + remaining text
// 'A Basic Oven #1' -> {name: 'A Basic Oven', number: 1}
function splitNumber(nftName) {
  let splitName = {
    'name': '',
    'number': -1
  };
  // split NFT name into name and number
  const regex = /(.+) #(\d+).*/;
  if (regex.test(nftName)) {
    // numbered
    const found = nftName.match(regex);
    splitName.name = found[1];
    splitName.number = parseInt(found[2]);
  }
  else {
    // unnumbered
    // remove 'Upgraded' text
    const regexUpgraded = /(.+) Upgraded.*/;
    if (regexUpgraded.test(nftName)) {
      const found = nftName.match(regexUpgraded);
      splitName.name = found[1];
    }
    else {
      splitName.name = nftName;
    }
  }

  return splitName;
}


// get dropdown item element
function getDropdownItemElement(value) {
  return `<li><a class="dropdown-item">${value}</a></li>`;
}


// filter specified dataTable column
// use regular expression (https://datatables.net/reference/api/column().search())
function filterDataTableColumn(column, filterCondition) {
  dataTable.column(column)
    .search(filterCondition, true, false, true)
    .draw();
}


export { main, parseNameCell, splitNumber };
