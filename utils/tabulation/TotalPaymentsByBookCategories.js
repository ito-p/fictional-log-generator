import TabulationQueryBuilder from 'tabulation-query-builder';

const tqb = new TabulationQueryBuilder();

tqb.setTable('actions');

tqb.setMatching({
  and: [
    {
      field: 'timestamp',
      range: [ '2017-01-01 00:00:00', '2017-01-03 23:59:59' ]
    },
    {
      field: 'action',
      in: [ 'purchase' ]
    }
  ]
});

tqb.setIndexing({
  field: 'detail->"$.item.category"'
});

tqb.setAggregating({
  field: 'detail->"$.item.price"',
  method: 'sum'
});

const query = tqb.build();

console.info(query);
