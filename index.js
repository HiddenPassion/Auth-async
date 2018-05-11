const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:27017/NestedCol');

const db = mongoose.connection;

db.on('error', console.error. bind(console, 'MongoDB connection error: '));


const childcSchema = new mongoose.Schema( {
	name: 'string',
	age: 'number',
});

const parentSchema =  new mongoose.Schema ( {
	profession: 'string',
	persons: [childcSchema],
});	

const Staff = mongoose.model('Staff', parentSchema);
/* Worked  create stucture
const staff = new Staff ( {
	profession: 'bucher',
	persons: [ 
		{name: 'Vasya', age: 40 },
		{name: 'Petya', age: 54 },
	]
});

staff.save()
	.then(res => {
	console.log(res);
	})
	.catch(e => console.log(e));
*/



/* Worked add new nested collection
const updated = Staff.findOneAndUpdate(
	{ profession: 'bucher'},
	{ $push: {persons: {name: 'Pasha', age: 70}}},
	{ safe: true, upsert: true});

updated.then( res => console.log(res));
*/

/* Worked find nested param
Staff.find({'persons.name': 'Pasha'}).then(res => {
	for( let i in res[0].persons)
	if (res[0].persons[i].name == 'Pasha') {
		console.log(res[0].persons[i]);
	}
});
*/

/* Worked remove nested elem
Staff.findOneAndUpdate(
	{ profession: 'bucher'},
	{ $pull: {persons: {name: 'Pasha'}}},
).then(res => console.log(res));
*/

/*
Staff.update(
	{ profession: 'bucher'},
	{ $pull: {persons: {name: 'Petya'}}},
).then(res => console.log(res));
*/

Staff.find().then(res => console.log(res));

/*
to push  new children use
const newdoc = staff.persons.create({})
*/
/*
childSchems.pre('save', (next) => {
	//do something when  it will save
})    // validate same as save ///if save and validate , at the beginer execute validate then save
*/

// module.exports = {

// };