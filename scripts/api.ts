import axios, {AxiosRequestConfig, AxiosResponse} from 'axios';

import entry_points from './server/api/entry-points';

import {GetUsersSuccess, GetUsersTarget} from './action/api/users';
import {PostQRCodeIssueSuccess} from './action/api/qrcode/issue';
import {PostQRCodeVerifySuccess} from './action/api/qrcode/verify';
import {PostLoginSuccess} from './action/api/login';
import {GetStatusSuccess} from './action/api/status';
import {PostRecordSuccess, AttendanceEventType} from './action/api/record';

const option: AxiosRequestConfig = {
    validateStatus: () => true
}

function checkData(result: AxiosResponse): any {
    if(!result.data || typeof result.data.type !== 'string') {
        throw result;
    }
    return result.data;
}

export async function getUsers(target: GetUsersTarget): Promise<GetUsersSuccess> {
    return checkData(await axios.get(entry_points.users, {...option, params: {target}}));
}

export async function issueQRCode(id: number): Promise<PostQRCodeIssueSuccess> {
    return checkData(await axios.post(entry_points.qrcode.issue, { id }, option));
}

export async function verifyQRCode({id, password}: {id: number, password: number}): Promise<PostQRCodeVerifySuccess> {
    return checkData(await axios.post(entry_points.qrcode.verify, { id, password }, option));
}

export async function login({id, password}: {id: number, password: number}): Promise<PostLoginSuccess> {
    return checkData(await axios.post(entry_points.login, {id, password}, option));
}

export async function status(login: string): Promise<GetStatusSuccess> {
    return checkData(await axios.get(entry_points.status, {...option, headers: {
        Authorization: 'Bearer ' + login
    }}));
}

export async function record({login, event}: {login: string, event: AttendanceEventType}): Promise<PostRecordSuccess> {
    return checkData(await axios.post(entry_points.record, {event}, {...option, headers: {
        Authorization: 'Bearer ' + login
    }}));
}