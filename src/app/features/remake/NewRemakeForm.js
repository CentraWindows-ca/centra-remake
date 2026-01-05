"use client";
import React, { useEffect } from "react";
import RemakeItem from "app/features/remake/RemakeItem";

import { Form, Button } from "antd";

export default function NewRemakeForm(props) {
	const { selectedRows } = props;

	const [newRemakeForm] = Form.useForm();
	// TODO: Extract form outside

	useEffect(() => {
		newRemakeForm.setFieldsValue({
			items: selectedRows.map(r => ({
				installationId: r.installationId,
				qty: r.qty,
				reason: null
			}))
		});
	}, [selectedRows]);

	return (
		<Form
			form={newRemakeForm}
			onFinish={values => console.log("values: ", values) }
		>
			<div className="mb-2 font-semibold text-blue-600">{`New Remake`}</div>
			<div className="mb-2">{`Original WO#: ${selectedRows?.[0].workOrderNo}`}</div>

			<Form.List name="items">
				{(fields) => (
					<>
						{fields?.map((field, index) =>
							<RemakeItem
								key={field.key}
								field={field}                 // ← AntD field (important)
								index={index}
								form={newRemakeForm}
								remakeItem={selectedRows[index]}     // ← Your original data
							/>)
						}
					</>
				)}
			</Form.List>
			
			<div className="text-right pt-2">
				<Button
					onClick={() => newRemakeForm.submit() }
				>
				OK
				</Button>
			</div>
		</Form>
	)
}