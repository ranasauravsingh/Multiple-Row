function localStorage_setitem(list) {
	localStorage.setItem("censusList", JSON.stringify(list));
}

function localStorage_getitem() {
	if (localStorage.getItem("censusList") == null) {
		var list = [];
		var id = 0;
	} else {
		var list = JSON.parse(localStorage.getItem("censusList"));
		var id = list[list.length - 1].AreaId + 1;
	}
	return { list, id };
}

if (censusList != []) {
	var censusList = localStorage_getitem().list;
	var AId = localStorage_getitem().id;
	var HId = localStorage_getitem().id;
	var MId = localStorage_getitem().id;
} else {
	var censusList = [];
	var AId = 0;
	var HId = 0;
	var MId = 0;
}

function addArea() {
	var newArea = $("<tbody></tbody>").text("");
	newArea.attr("id", "areaBody" + AId + "");
	$("#censusForm").append(newArea);

	var rowArea = [
		"<tr>",
		'<td><input type="text" name="areaName" /> </td>',
		"<td><table border=1 id='areaTable" +
			AId +
			"'><tr><th>House Name</th><th>Member Details</th><th>Action</th>",
		"</tr>",
		'</table><input type="button" value="Add" onclick="addHouse(' +
			AId +
			')" />',
		'<td><input type="button" value="Remove" onclick="removeArea(' +
			AId +
			')" /> </td>',
		"</tr>",
	].join("");
	$("#areaBody" + AId + "").append(rowArea);

	$("#insertBtn").css("display", "inline-block");
	AId++;
}

function removeArea(areaId) {
	$("#areaBody" + areaId + "").remove();
}

function addHouse(areaId) {
	var newHouse = $("<tbody></tbody>").text("");
	newHouse.attr("id", "houseBody" + HId + "");
	$("#areaTable" + areaId + "").append(newHouse);

	var rowHouse = [
		"<tr>",
		'<td><input type="text" name="houseName' + areaId + '" /> </td>',
		"<td><table id='houseTable" +
			HId +
			"'><tr><th>Member Name</th><th>Member Age</th><th>Gender</th><th>Action</th></tr>",
		"</tr>",
		'</table><input type="button" value="Add" onclick="addMember(' +
			HId +
			')" />',
		'<td><input type="button" value="Remove" onclick="removeHouse(' +
			HId +
			')" /> </td>',
		"</tr>",
	].join("");
	$("#houseBody" + HId + "").append(rowHouse);

	HId++;
}

function removeHouse(houseId) {
	$("#houseBody" + houseId + "").remove();
}

function addMember(houseId) {
	var newMember = $("<tbody></tbody>").text("");
	newMember.attr("id", "memberBody" + MId + "");
	$("#houseTable" + houseId + "").append(newMember);

	var rowMember = [
		"<tr>",
		'<td><input type="text" name="memName' + houseId + '" /> </td>',
		'<td><input type="number" name="memAge' + houseId + '" /> </td>',
		'<td><input type="text" name="memGen' + houseId + '" /></td>',
		'<td><input type="button" value="Remove" onclick="removeMember(' +
			MId +
			')" /> </td>',
		"</tr>",
	].join("");
	$("#memberBody" + MId + "").append(rowMember);

	MId++;
}

function removeMember(memberId) {
	$("#memberBody" + memberId + "").remove();
}

function deleteData(aInd, hInd = null, mInd = null) {
	if (confirm("Are you sure you want to delete the data?")) {
		// document.getElementById("insertBtn").value = "Add";
		// document.getElementById("product").reset();

		if (mInd != null) {
			censusList[aInd].houseDetails[hInd].memDetails.splice(mInd, 1);
		} else if (hInd != null) {
			censusList[aInd].houseDetails.splice(hInd, 1);
		} else {
			censusList.splice(aInd, 1);
		}
		localStorage_setitem(censusList);
		alert("Census Data deleted Successfully !");
		view();
	}
}

function deleteTree() {
	if (confirm("Are you sure you want to delete the data?")) {
		var aData = $('[name="areaCheck"]');

		for (var i = 0; i < censusList.length; i++) {
			var hData = $('[name="houseCheck' + i + '"]');

			var houseLen = censusList[i].houseDetails;
			for (var j = 0; j < houseLen.length; j++) {
				var mData = $('[name="memCheck' + i + "" + j + '"]');

				if (mData != []) {
					var memLen = houseLen[j].memDetails;
					for (var k = 0; k < memLen.length; k++) {
						if (mData[k].checked == true) {
							// console.log(mData[k].value);
							censusList[i].houseDetails[j].memDetails.splice(
								parseInt(mData[k].value),
								1
							);
						}
					}
				}

				// console.log(hData[j]);
				if (hData[j].checked == true) {
					censusList[i].houseDetails.splice(parseInt(hData[j].value), 1);
				}
			}

			if (aData[i].checked == true) {
				censusList.splice(parseInt(aData[i].value), 1);
			}
		}

		localStorage_setitem(censusList);
		alert("Census Data deleted Successfully !");
		view();
	}
}

function view() {
	if (censusList.length == 0) {
		$("label").css("display", "none");
		$("#censusTable").css("display", "none");
		alert("Empty Census Data !!!, Please submit the census form...");
	} else {
		$("label").css("display", "block");
		$("#censusTable").css("display", "inline-block");

		$("#censusTable").html(
			"<tr><th>Area Id</th><th>Area Name</th><th>House Details</th><th>Action</th></tr>"
		);

		var treeString = "";

		for (var i = 0; i < censusList.length; i++) {
			var newArea = $("<tbody></tbody>").text("");
			newArea.attr("id", "areaBody" + i + "");
			$("#censusTable").append(newArea);

			var rowArea = [
				"<tr>",
				"<td>" + censusList[i].AreaId + " </td>",
				"<td>" + censusList[i].AreaName + " </td>",
				"<td><table border=1 id='areaTable" +
					i +
					"'><tr><th>House Name</th><th>Member Details</th><th>Action</th>",
				"</tr>",
				"</table></td>",
				"<td><input type='button' onclick='deleteData(" +
					i +
					")' value='Delete'/></td>",
				"</tr>",
			].join("");
			$("#areaBody" + i + "").append(rowArea);

			var houseLen = censusList[i].houseDetails;

			if (houseLen.length != 0) {
				treeString +=
					'<li><span class="caret"><i class="fa-solid fa-caret-right"></i><input type="checkbox" name="areaCheck" value="' +
					i +
					'" />' +
					"Area" +
					censusList[i].AreaId +
					": " +
					censusList[i].AreaName +
					'</span><ul class="nested">';
			} else {
				treeString +=
					"<li><input type='checkbox' name='areaCheck' value='" +
					i +
					"' />" +
					"Area" +
					censusList[i].AreaId +
					": " +
					censusList[i].AreaName +
					"</li>";
			}

			for (var j = 0; j < houseLen.length; j++) {
				var newHouse = $("<tbody></tbody>").text("");
				newHouse.attr("id", "houseBody" + i + "" + j + "");
				$("#areaTable" + i + "").append(newHouse);
				// if (i == 1) {
				// 	console.log("saurav");
				// 	$("#areaTable" + 1 + "").append(newHouse);
				// }
				// console.log($("#areaTable" + j + "").html());

				var rowHouse = [
					"<tr>",
					"<td>" + houseLen[j].HouseName + "</td>",
					"<td><table id='houseTable" +
						i +
						"" +
						j +
						"'><tr><th>Member Name</th><th>Member Age</th><th>Gender</th><th>Action</th></tr>",
					"</tr>",
					"</table></td>",
					"<td><input type='button' onclick='deleteData(" +
						i +
						"," +
						j +
						")' value='Delete'/></td>",
					"</tr>",
				].join("");
				$("#houseBody" + i + "" + j + "").append(rowHouse);

				var memLen = houseLen[j].memDetails;

				if (memLen.length != 0) {
					treeString +=
						'<li><span class="caret"><i class="fa-solid fa-caret-right"></i><input type="checkbox" name="houseCheck' +
						i +
						'" value="' +
						j +
						'" />' +
						"House" +
						j +
						": " +
						houseLen[j].HouseName +
						'</span><ul class="nested">';
				} else {
					treeString +=
						"<li><input type='checkbox' name='houseCheck" +
						i +
						"' value='" +
						j +
						"' />" +
						"House" +
						j +
						": " +
						houseLen[j].HouseName +
						"</li>";
				}

				for (var k = 0; k < memLen.length; k++) {
					var newMember = $("<tbody></tbody>").text("");
					newMember.attr("id", "memberBody" + i + "" + j + "" + k + "");
					$("#houseTable" + i + "" + j + "").append(newMember);

					var rowMember = [
						"<tr>",
						"<td>" + memLen[k].MemberName + "</td>",
						"<td>" + memLen[k].MemberAge + "</td>",
						"<td>" + memLen[k].Gender + "</td>",
						"<td><input type='button' onclick='deleteData(" +
							i +
							"," +
							j +
							"," +
							k +
							")' value='Delete'/></td>",
						"</tr>",
					].join("");
					$("#memberBody" + i + "" + j + "" + k + "").append(rowMember);

					treeString +=
						"<li><input type='checkbox' name='memCheck" +
						i +
						"" +
						j +
						"' value='" +
						k +
						"' />" +
						memLen[k].MemberName +
						"</li>" +
						"<li><input type='checkbox' name='memCheck" +
						i +
						"" +
						j +
						"' value='" +
						k +
						"' />" +
						memLen[k].MemberAge +
						"</li>" +
						"<li><input type='checkbox' name='memCheck" +
						i +
						"" +
						j +
						"' value='" +
						k +
						"' />" +
						memLen[k].Gender +
						"</li>";
				}

				if (houseLen[j].memDetails) {
					treeString += "</ul></li>";
				}
			}

			if (censusList[i].houseDetails) {
				treeString += "</ul></li>";
			}
		}

		treeString +=
			"<input type='button' value='Update' onclick='updateTree()'/><input type='button' value='Delete' onclick='deleteTree()'/>";
		$("#treeView").html(treeString);
		treeView();
	}
}

function insert() {
	var areaEl = document.getElementsByName("areaName");

	for (var i = 0; i < areaEl.length; i++) {
		var len = censusList.length;
		var tempArea = { AreaId: len, AreaName: areaEl[i].value };

		var tempHouseList = [];
		var houseEl = document.getElementsByName("houseName" + len + "");
		for (var j = 0; j < houseEl.length; j++) {
			var tempHouse = { HouseName: houseEl[j].value };

			var tempMemList = [];
			// console.log(i, j);

			var memNameEl = document.getElementsByName("memName" + len);
			// console.log(memNameEl);

			var memAgeEl = document.getElementsByName("memAge" + len);
			var memGenEl = document.getElementsByName("memGen" + len);
			for (var k = 0; k < memNameEl.length; k++) {
				var tempMember = {
					MemberName: memNameEl[k].value,
					MemberAge: memAgeEl[k].value,
					Gender: memGenEl[k].value,
				};
				tempMemList.push(tempMember);
			}
			tempHouse["memDetails"] = tempMemList;
			tempHouseList.push(tempHouse);
		}
		// console.log(tempHouseList);

		tempArea["houseDetails"] = tempHouseList;
		censusList.push(tempArea);
	}
	alert("Census Data submitted Successfully !");
	localStorage_setitem(censusList);

	for (var i = 0; i <= censusList.length; i++) {
		removeArea(i);
	}
	view();
}

view();

function treeView() {
	var toggler = $(".caret");
	for (var i = 0; i < toggler.length; i++) {
		// console.log(toggler[i].children[0].classList);
		toggler[i].addEventListener("click", function () {
			this.parentElement.querySelector(".nested").classList.toggle("active");
			this.firstElementChild.classList.toggle("caret-down");
		});
		// toggler[i].firstElementChild.classList.addEventListener("click", function () {
		// 	toggler[i].firstElementChild.classList.toggle("caret-down");
		// });
	}
}
