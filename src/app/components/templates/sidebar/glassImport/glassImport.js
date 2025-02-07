"use client"
import React, { useState, useCallback } from "react";

import { Upload, Select, Button } from "antd";
const { Dragger } = Upload;

import { importGlass } from "app/api/productionApis";

import { openBlob, getBase64, DataURIToBlob } from "app/utils/utils";

export default function GlassImport() {
    const [file, setFile] = useState(null);
    const [company, setCompany] = useState("GL-CAR");

    const openDocument = useCallback((e) => {
        if (e) {
            let fileData = e.originFileObj;

            getBase64(fileData)
                .then((res) => {
                    if (res) {
                        let base64Data = res?.split(",")[1];
                        if (base64Data?.length > 1) {
                            openBlob(base64Data, fileData.type);
                        }                       
                    }                    
                })
                .catch((error) => {
                    console.log(`File parse failed: ${error}`)
                })
        }
    }, []);

    const uploadProps = {
        name: 'file',
        multiple: false,
        maxCount: 1,
        beforeUpload: () => {
            return false;
        },
        onChange(info) {            
            if (info.file.status !== "uploading") {                  
                if (info?.fileList?.length > 0) {                        
                    let base64Data = getBase64(info.file);
                    base64Data.then(res => setFile(res));                        
                }
            }            
        },
        onRemove(e) {
            setFile(null);
        },
        onPreview(e) {
            openDocument(e);
        }
    }

    const handleSubmit = useCallback((e) => {
        if (company && file) {
            const blob = DataURIToBlob(file)
            const formData = new FormData();
            formData.append('data', blob);
            
            importGlass(company, formData);
        }
    }, [company, file]);

    return (
        <div className="pt-4">
            <Select
                defaultValue="Cardinal"
                style={{ width: "100%" }}
                onChange={(e) => setCompany(e)}
                options={[
                    { value: 'GL-CAR', label: 'Cardinal' },
                    { value: 'PFG', label: 'PFG' },
                ]}
                className="mb-3"
            />
            <Dragger {...uploadProps} >
                <p className="ant-upload-drag-icon">
                    <i className="fa-solid fa-cloud-arrow-up text-2xl text-blue-500 pt-1"></i>
                </p>
            <p className="ant-upload-text" style={{fontSize: "0.9rem"}}>Drag and drop or click to add files.</p>
            </Dragger>
            <div className="flex flex-row justify-end pt-3 w-100 border-b pb-3 border-dotted">
                <Button
                    type="primary"
                    disabled={!file}
                    onClick={handleSubmit}
                >
                    Submit
                </Button>
            </div>
        </div>           
    );
}
