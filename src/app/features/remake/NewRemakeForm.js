"use client";
import React from "react";
import RemakeItem from "app/features/remake/RemakeItem";


import { Form } from "antd";

export default function NewRemakeForm(props) {
	const { selectedRows } = props;

	const [newRemakeForm] = Form.useForm();

	return (
		<div>
			<div className="mb-2">New Remake Form</div>
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