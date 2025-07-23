import '../scss/globals.scss'

import { createTabs } from './components/tabs-component.js'
import { createTable } from './components/table/_index.js'

import { createServiceSelect } from './components/service-select-component.js';
import { createSlotSelect } from './components/slot-select-component.js';
import { initializeToaster } from './components/toast-component.js';

$(document).ready(function () {
  createTabs({ target: '.table-management', configPath: 'config.json' })
  createTable({ target: '.table-container' })
  

  createServiceSelect({ target: '.table-management' })
  createSlotSelect({ target: '.c-slot-manager' })
 
  initializeToaster()

  const savedService = JSON.parse(localStorage.getItem('selectedService'));
  if (savedService) {
    $(document).trigger('service:selected', { service: savedService });
  }
})
