let NFTList;

beforeAll(async () => {
  NFTList = await import('nftlist.js');
});

describe('parseNameCell()', () => {
  test('#1', () => {
    const cell = `<td class="sorting_1">
    <div class="row">
        A Basic Oven #1
    </div>
    <div class="row">
        <small>nft1e6ea23xyyw5y7jzacph090crrhyeswcc8gvy9nwmy54xyjgkr4vsn2hjxa</small>
    </div>
  </td>`;
    expect(NFTList.parseNameCell(cell))
    .toEqual({nftName: 'A Basic Oven #1', nftId: 'nft1e6ea23xyyw5y7jzacph090crrhyeswcc8gvy9nwmy54xyjgkr4vsn2hjxa'});
  });

  test('#2', () => {
    const cell = `<td class="sorting_1">
    <div class="row">A Basic Oven #1</div>
    <div class="row"><small>
        nft1e6ea23xyyw5y7jzacph090crrhyeswcc8gvy9nwmy54xyjgkr4vsn2hjxa
        </small></div></td>`;
    expect(NFTList.parseNameCell(cell))
    .toEqual({nftName: 'A Basic Oven #1', nftId: 'nft1e6ea23xyyw5y7jzacph090crrhyeswcc8gvy9nwmy54xyjgkr4vsn2hjxa'});
  });
});

describe('splitNumber()', () => {
  test('#1', () => {
    const nftName = 'A Basic Oven #1';
    expect(NFTList.splitNumber(nftName))
    .toEqual({name: 'A Basic Oven', number: 1});
  });

  test('#2', () => {
    const nftName = 'Automated Farm Bot #10-10';
    expect(NFTList.splitNumber(nftName))
    .toEqual({name: 'Automated Farm Bot', number: 10});
  });

  test('#3', () => {
    const nftName = 'Forest Plot #10 - Upgraded (15)';
    expect(NFTList.splitNumber(nftName))
    .toEqual({name: 'Forest Plot', number: 10});
  });

  test('#4', () => {
    const nftName = 'Repaired Robot Upgraded (25)';
    expect(NFTList.splitNumber(nftName))
    .toEqual({name: 'Repaired Robot', number: -1});
  });

  test('#5', () => {
    const nftName = 'Foobar';
    expect(NFTList.splitNumber(nftName))
    .toEqual({name: 'Foobar', number: -1});
  });
});
