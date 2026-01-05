"use client";
import React from "react";
import RemakeItem from "app/features/remake/RemakeItem";


import { Form } from "antd";

export default function NewRemakeForm(props) {
	const { selectedRows } = props;

	const [newRemakeForm] = Form.useForm();

	return (
		<div>
			<div className="mb-2 font-semibold text-blue-600">{`New Remake`}</div>
			<div className="mb-2">{`Original WO#: ${selectedRows?.[0].workOrderNo}`}</div>
			{selectedRows?.map((remakeItem, index) =>
			<RemakeItem
				remakeItem={remakeItem }
					key={index}
					form={newRemakeForm}
					selectedRows={selectedRows}
				/>)
			}
		</div>
	)
}