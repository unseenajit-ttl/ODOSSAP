import { Injectable } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { ConfigService } from '../../app/core/config.service'
import { Observable } from 'rxjs'
import { ToasterService } from 'src/app/services/toaster.service'

@Injectable({
  providedIn: 'root',
})
export class ExportService {
  constructor(
    private http: HttpClient,
    private configService: ConfigService,
   
    public toaster: ToasterService
  ) {}

  public downloadCV(format: string): Observable<any> {
    return this.http.get(this.configService.config.apiDomain + `export/cv?format=${format}`, {
      responseType: 'blob',
    })
  }

  public downloadSupporterReferenceForm(supporterId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/supporter-feedback/${supporterId}`,
      { responseType: 'blob' }
    )
  }

  public downloadProfRegApplication(applicationId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/prof-reg-application/${applicationId}`,
      { responseType: 'blob' }
    )
  }

  public downloadAssessmentSummaryForVerifier(
    verifierTicketId: string,
    assessmentArchiveId: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.guestApiDomain +
        `export/verifier/${verifierTicketId}/assessment-summary/${assessmentArchiveId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadAssessmentSummary(assessmentArchiveId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/assessment-summary/${assessmentArchiveId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadActivityLog(
    startDate: string,
    endDate: string,
    declarationYear: number,
    locked: boolean
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/log-cpd-activity-report/${startDate}/${endDate}/${declarationYear}?locked=${locked}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCPDPlan(
    startDate: string,
    endDate: string,
    declarationYear: number,
    locked: boolean
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-plan-report/${startDate}/${endDate}/${declarationYear}?locked=${locked}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCPDReviewSummary(declarationYear: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/cpd-review-summary-report/${declarationYear}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadDeclarationSummary(
    declarationYear: string,
    declarationId: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-declaration-summary/${declarationYear}/${declarationId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public exportSchemeDetailsToExcel(schemeId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/manage-scheme-report/${schemeId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCPDplanningReportForVerifier(
    verifierTicketId: string,
    reportid: number
  ): Observable<any> {
    return this.http.get(
      this.configService.config.guestApiDomain +
        `export/verifier/${verifierTicketId}/cpd-planning-report/${reportid}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadMentorFeedbackForCpdReport(reportid: number, locked: boolean): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/mentor-feedback-cpd-planning-report/${reportid}?locked=${locked}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCpdLogIetScheme(startDate: string, endDate: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-activity-done-state-report/${startDate}/${endDate}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCpdPlanIetScheme(): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/cpd-plan-iet-scheme-report`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadFrameworkAssessmentLive(): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/framework-assessment-report`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadIpdPack(appuserId: string, startDate: string, endDate: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/ipd-pack/${appuserId}/${startDate}/${endDate}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCPDReturnsPack(
    appuserId: string,
    declarationYear: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-returns-pack/${appuserId}/${declarationYear}/${startDate}/${endDate}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadProfRegLiveApplication(applicationId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/prof-reg-application/${applicationId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCPDPlanForAdvisor(
    startDate: string,
    endDate: string,
    declarationYear: number,
    appuserId: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-plan-report-for-advisor/${appuserId}/${startDate}/${endDate}/${declarationYear}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadActivityLogForAdvisor(
    startDate: string,
    endDate: string,
    declarationYear: number,
    appuserId: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/log-cpd-activity-report-for-advisor/${appuserId}/${startDate}/${endDate}/${declarationYear}`,
      {
        responseType: 'blob',
      }
    )
  }

  public handleError() {
    console.log("Sorry, the request failed. Please try again later.")

  }

  public downloadCpdPlanIetSchemeReportForUser(appUserId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/cpd-plan-report/${appUserId}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCpdActivityReportForUser(
    appUserId: string,
    startDate: string,
    endDate: string
  ): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain +
        `export/cpd-activity-report/${appUserId}/${startDate}/${endDate}`,
      {
        responseType: 'blob',
      }
    )
  }

  public downloadCompetenceAssessmentReportForUser(appUserId: string): Observable<any> {
    return this.http.get(
      this.configService.config.apiDomain + `export/cpd-competence-assessment-report/${appUserId}`,
      {
        responseType: 'blob',
      }
    )
  }
}
