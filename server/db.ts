import Database from './dbApi'

const test = async () => {
  console.log('hai')
  await Database.dbAdd('T2-2019', { id: 'COMP1521', vac: '0', gh: 8 })
  let doc = await Database.dbRead('T2-2019', 'COMP1521')
  console.log(doc)
  await Database.dbUpdate('T2-2019', 'COMP1521', { vac: '5' })
  doc = await Database.dbRead('T2-2019', 'COMP1521')
  console.log(doc)
  await Database.dbDel('T2-2019', 'COMP1521')
}

test().then(() => {
  Database.disconnect()
  process.exit()
})
