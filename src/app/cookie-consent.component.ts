import { AfterViewInit, Component, ElementRef, Inject } from '@angular/core'
import { HttpClient } from '@angular/common/http'
import { DOCUMENT } from '@angular/common'
import { filter, map } from 'rxjs/operators'
import { ActivationEnd, NavigationEnd, Router } from '@angular/router'


declare var window: any

@Component({
  selector: 'cm-cookie-consent',
  template: '',
})
export class CookieConsentComponent implements AfterViewInit {
  constructor(
    private http: HttpClient,  
    @Inject(DOCUMENT) private document: Document,
    private elementRef: ElementRef,
    private router: Router,
    
  ) {}

  ngAfterViewInit(): void {
    this.http
    ///Add API Path
      .get<any>("this.configService.config.apiDomain" + `cookie-config`)
      .pipe(map(res => this.removeCookieConfigNulls(res)))
      .subscribe(res => this.loadCookieScript(res))
  }

  private loadCookieScript(response:any) {
    if (!response?.CookieUrl) {
      return
    }

    const s = this.document.createElement('script')
    s.type = 'text/javascript'
    s.src = response.CookieUrl
    // to store the current instance to call
    // afterScriptAdded function on onload event of
    // script.
    const myself = this
    s.onload = () => myself.cookieScriptLoaded(response.CookieConfig)

    this.elementRef.nativeElement.appendChild(s)
  }

  private cookieScriptLoaded(cookieConfig:any) {
    if (window.CookieControl) {
      window.CookieControl.load(cookieConfig)

      let path = ''
      this.router.events.subscribe(event => {
        // child routes will complete activation before the parent
        // we track the current path and keep on prepending the parent path
        // to get the complete route config
        if (event instanceof ActivationEnd) {
          if (event?.snapshot?.routeConfig?.path) {
            path =
              path === ''
                ? event.snapshot.routeConfig.path
                : [event.snapshot.routeConfig.path, path].join('/')
          }
        } else if (event instanceof NavigationEnd) {
          // this fires towards the end and we can now use the path that we have
          // generated using the ActivationEnd to build a URL for GA
          // We basically prase the path and strip out any params from the URL
          const urlTree = this.router.parseUrl(path)
          const urlWithoutParams = urlTree.root.children['primary'].segments
            .map(it => it.path)
            .filter(segment => !segment.startsWith(':'))
            .join('/')
        

          // ensure that we clear the path after tracking the page
          path = ''
        }
      })
    }
  }

  private removeCookieConfigNulls(response:any): any {
    if (!response?.CookieConfig) {
      return response
    }

    for (const i of Object.keys(response.CookieConfig)) {
      if (response.CookieConfig[i] === null) delete response.CookieConfig[i]

      if (i === 'text') {
        for (const ii in response.CookieConfig[i]) {
          if (response.CookieConfig[i][ii] === null) delete response.CookieConfig[i][ii]
        }
      }
    }

    // Loop through all of the scripts and wrap them in a function
    for (const i of Object.keys(response.CookieConfig.optionalCookies)) {
      const optionalCookie = response.CookieConfig.optionalCookies[i]
      optionalCookie.onAccept = new Function(optionalCookie.onAccept)
      optionalCookie.onRevoke = new Function(optionalCookie.onRevoke)
    }

    return response
  }
}
