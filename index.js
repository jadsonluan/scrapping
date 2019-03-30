var data;

Papa.parse('resources/horario20191.csv', {
  download: true,
  dynamicTyping: true,
  complete: function(results) {
    data = results.data;
	data = data.splice(3);
    data = process(data);
    data = normalize(data);
	console.log(data);
  }
});

// SALA/DISC/PROF/CAT/PER(ant;nov)

function process(data) {
	var row;
	var result = [];
	var hour = data[0][0];
	
	for (var i = 0; i < data.length; i++) {
		row = data[i];
		if (row[0] != null && row[0] != hour) hour = row[0];
		
		if (!isEmptyRow(row)) {
			row[0] = hour;
			result.push(row); 
		}
	}

	return result;
}

function normalize(data) {
	var row;
	var result = [];

	for (var i = 1; i < data.length; i++) {
		row = data[1];
		examinateRow(row, result);
	}
	return result;
}

function split(row, separator) {
	var result = [];
	var temp = [];
	
	for (var i = 0; i < row.length; i++) {
		if (row[i] == separator || i == row.length - 1) {
			result.push(temp);
			temp = [];
		} else {
			temp.push(row[i]);
		}
	}

	return result;
}

function examinateRow(row, result) {
	var hour = row.shift();
	var data = split(row, null);
	var subject = {};
	var _data = [];
	var subject, numClass;
	var days = ["monday", "tuesday", "wednesday", "thursday", "friday"];

	for (var i = 0; i < data.length; i++) {
		subject = numClass = "unknown";
		_data = data[i];
		if (_data[1]) {
			subject = _data[1].slice(0, -3);
			numClass = _data[1].slice(-2);
		}
		subject = {
			"room": 		_data[0],
			"subject": 		subject,
			"class": 		numClass,
			"teacher": 		_data[2], 
			"type": 		_data[3],
			"period": 		_data[4],
			"class-time": [{
				"hour": hour,
				"day": days[i]
			}]
		}
		result.push(subject);
	}
}

function isEmptyRow(row) {
	return row[0] == null && row[1] == null;
}