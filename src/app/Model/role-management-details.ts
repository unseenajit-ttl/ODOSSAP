import { number } from "mathjs"
import { FormDetails } from "./form-details"

export interface RoleManagementDetails {


    isSelected: boolean,
    isExpand: boolean,
    CurrentLoginUserId: number
    EmailId: string
    Initial: string
    IsSelected: boolean
    Status: number
    UserId: number
    UserName: string
    LoginName: string
    pages: FormDetails[]
}
