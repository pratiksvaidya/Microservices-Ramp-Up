import { shallowMount, createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import Email from '@/components/Email';
import Chart from '@/components/Chart';
import DatePicker from 'v-calendar/lib/components/date-picker.umd';
import mockAxios from 'axios';

let wrapper;
let store;
let actions;
let mutations;
let state;
const localVue = createLocalVue();
localVue.use(Vuex);

beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    value: jest.fn(() => ({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    })),
  });
});

beforeEach(() => {
  mutations = {
    updateLoaded: jest.fn(),
  };

  state = {
    loaded: true,
  };

  store = new Vuex.Store({
    actions,
    mutations,
    state,
  });

  wrapper = shallowMount(Email, {
    propsData: {},
    mocks: {},
    stubs: {},
    methods: {},
    store,
    localVue,
  });
});

afterEach(() => {
  wrapper.destroy();
});

describe('Email.vue', () => {
  it('is a Vue instance', () => {
    expect(wrapper.isVueInstance).toBeTruthy();
  });

  it('should render correct logo', () => {
    expect(wrapper.vm.$el.querySelector('img').getAttribute('src'))
      .toEqual('../assets/gmail_logo.png');
  });

  it('should contain date picker', () => {
    expect(wrapper.contains(DatePicker))
      .toBe(true);
  });

  it('should contain line chart', () => {
    expect(wrapper.contains(Chart))
      .toBe(true);
  });

  it('should not contain date picker when loading', () => {
    state = { loaded: false };

    store = new Vuex.Store({ actions, mutations, state });

    wrapper = shallowMount(Email, {
      propsData: {},
      mocks: {},
      stubs: {},
      methods: {},
      store,
      localVue,
    });

    expect(wrapper.contains(DatePicker))
      .toBe(false);
  });

  it('should not contain line chart when loading', () => {
    state = { loaded: false };

    store = new Vuex.Store({ actions, mutations, state });

    wrapper = shallowMount(Email, {
      propsData: {},
      mocks: {},
      stubs: {},
      methods: {},
      store,
      localVue,
    });

    expect(wrapper.contains(Chart))
      .toBe(false);
  });

  it('should contain the correct number of datasets', () => {
    expect(wrapper.vm.chartdata.datasets.length)
      .toBe(4);
  });

  it('should contain the correct dataset labels', () => {
    const labels = ['Incoming Non-Gmail Messages',
      'Incoming Gmail Messages',
      'Outgoing Non-Gmail Messages',
      'Outgoing Gmail Messages'];

    wrapper.vm.chartdata.datasets.forEach((dataset) => {
      expect(labels.includes(dataset.label))
        .toBeTruthy();
    });
  });

  it('should call API endpoint with default params', async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({ data: [{ 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577192400' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '3' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577268000' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '1' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577588400' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '1' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577397600' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '3' } }] }),
    );

    await wrapper.vm.storeMetrics();

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://n2c2iurxbb.execute-api.us-east-1.amazonaws.com/prod/metrics',
      { params: { start: 0, end: 9999999999 } },
    );
  });

  it('should call API endpoint with custom params', async () => {
    mockAxios.get.mockImplementation(() =>
      Promise.resolve({ data: [{ 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577192400' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '3' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577268000' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '1' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577588400' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '1' } }, { 'outgoing-non-gmail-msgs': { N: '0' }, id: { N: '1577397600' }, 'outgoing-gmail-msgs': { N: '0' }, 'incoming-gmail-msgs': { N: '0' }, 'incoming-non-gmail-msgs': { N: '3' } }] }),
    );

    state = {
      dateRange: {
        start: 0,
        end: 1577588400,
      },
    };

    store = new Vuex.Store({ actions, mutations, state });

    wrapper = shallowMount(Email, {
      propsData: {},
      mocks: {},
      stubs: {},
      methods: {},
      store,
      localVue,
    });

    await wrapper.vm.storeMetrics();

    expect(mockAxios.get).toHaveBeenCalledWith(
      'https://n2c2iurxbb.execute-api.us-east-1.amazonaws.com/prod/metrics',
      { params: { start: 0, end: 1577588 } },
    );
  });
});
