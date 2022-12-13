# baz

## NFT List JavaScript module (ECMAScript module)

This module is for the NFT List page.

It is a port of an existing script, plus the addition of a name filter.<br>
Also includes HTML for name filter.


## Run locally
1. Add the HTML element
    * `nftlist.html`

2. Start the Live Server
    * port: `5500` (default)

3. Run the script in the browser's console

    ```js
    // Remove already existing dataTable and filter event handlers
    $('#nftlist').DataTable().destroy();
    $('[id^="nftListFilterResource"]').off('change');
    $('[id^="nftListFilterAmount"]').off('change');

    // Import module dynamically and call main process
    import('http://127.0.0.1:5500/nftlist.js').then(NFTList => {
      NFTList.main();
    });
    ```


## Integrate

* HTML

    ```html
    <div class="row mb-3">
      <!-- add here -->
      <div class="col-auto">
        Resource:
        <div>...</div>
      </div>
      <div class="col-auto">
        Amount:
        <div>...</div>
      </div>
    </div>
    ```

* JavaScript

    ```diff
    $(document).ready(function() {
    +   import('./nftlist.js').then(NFTList => {
    +     NFTList.main();
    +   });
    -   $('#nftlist').DataTable({
    -     order: [[1,'asc']],
    -     pageLength: 50,
    -     columns :[
    -       null,
    -       null,
    -       null,
    -       null,
    -       null,
    -       {searchable: false}
    -     ],
    -   });
    - 
    -   $('[id^="nftListFilterResource"]').on('change', function(eventObject){
    -     var searchTerms = [];
    -     $.each($('[id^="nftListFilterResource"]'), function(index, element){
    -       if ($(element).prop('checked')) {
    -         searchTerms.push('^' + $(this).val() + '$');
    -       }
    -     });
    -     $('#nftlist').DataTable().column(2).search(searchTerms.join('|'),true, false, true).draw();
    -   });
    - 
    -   $('[id^="nftListFilterAmount"]').on('change', function(eventObject) {
    -     var searchTerms = [];
    -     $.each($('[id^="nftListFilterAmount"]'), function(index, element) {
    -       if ($(element).prop('checked')) {
    -         searchTerms.push('^' + $(this).val() + '$');
    -       }
    -     });
    -     $('#nftlist').DataTable().column(3).search(searchTerms.join('|'),true, false, true).draw();
    -   });
    });
    ```


## Development environment

### npm package

* Install all packages at once

  ```
  npm install
  ```

  This will install the following packages

  ```
  npm install --save-dev eslint
  npm install --save-dev eslint-plugin-jest
  npm install --save-dev jest
  npm install --save-dev jest-environment-jsdom
  ```

### VS Code extension

* Live Server

* ESLint

* Jest

### Command

* run ESLint manually

  ```
  npm run lint
  ```

* run Jest manually

  ```
  npm test
  ```
