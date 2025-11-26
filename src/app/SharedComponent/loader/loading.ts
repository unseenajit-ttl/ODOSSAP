
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
	selector: 'loading',
	template: `		<div id="pause" class="d-flex align-items-center justify-content-center">
									<div id="spinner"></div>
								</div>`,
	styleUrls: ['loading.scss']
})
export class LoadingComponent implements OnInit {
	ngOnInit(): void {	}
}
