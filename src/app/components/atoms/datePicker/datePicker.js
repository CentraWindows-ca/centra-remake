"use client";
import React from "react";
import { DatePicker } from 'antd';
import momentGenerateConfig from 'rc-picker/lib/generate/moment';

const AntDatePicker = DatePicker.generatePicker(momentGenerateConfig);

export default AntDatePicker;