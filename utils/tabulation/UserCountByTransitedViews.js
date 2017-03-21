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
      in: [ 'transit' ]
    }
  ]
});

tqb.setIndexing({
  field: 'detail->"$.view"'
});

tqb.setAggregating({
  field: 'user_id',
  method: 'count'
});

const query = tqb.build();

console.info(query);
