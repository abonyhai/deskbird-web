import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export class SubscriptionCleanup implements OnDestroy {
  // eslint-disable-next-line rxjs/suffix-subjects
  protected destroy$: Subject<boolean> = new Subject<boolean>();

  constructor() {}

  public ngOnDestroy(): void {
    this.destroy$.next(true);
    // Now let's also unsubscribe from the subject itself:
    this.destroy$.complete();
  }
}
