import React from 'react';
import {IndexRoute, Route} from 'react-router';
import {isLoaded as isAuthLoaded, load as loadAuth } from 'redux/modules/auth';
import { load as loadTranslations } from 'redux/modules/languages';
import {
    App,
    Home,
    Login,
    ChangePassword,
    ForgotPassword,
    Profile,
    Schedule,
    NotFound,

    // Module Pages
    Modules,
    Module,
    ModuleAssignments,
    ModuleGrades,
    ModuleEdit,
    ModuleInfo,
    ModuleMaterials,
    ModuleLectures,
    ModuleLecture,

    // Course Pages
    Course,
    CourseInfo,
    CourseEdit,
    CourseClasses,

    // Class Pages
    ClassNew,
    ClassModules,

    // Level Pages
    Level,
    LevelInfo,
    LevelModules,

    // Teacher Pages
    Manage,
    ManageModule,
    ManageModules,
    ManageCourses,
    ManageModuleInfo,
    ManageModuleLectures,
    ManageModuleStudents,
    ManageModuleAssignments,
    ManageModuleAnnouncements,
  } from 'containers';

export default (store) => {
  const requireAdmin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user || !user.admin) {
        // oops, not logged in or does not have access rights, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    store.dispatch(loadTranslations('en'));

    if (!isAuthLoaded(store.getState())) {
      const result = store.dispatch(loadAuth());
      if (result.then) {
        result.then(checkAuth);
      } else {
        checkAuth();
      }
    } else {
      checkAuth();
    }
  };

  const requireTeacher = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      let isTeacher = false;

      // Check if the module code is inside the modules with access
      const modulesWithAccess = store.getState().auth.user.write_access;
      for (const code of modulesWithAccess) {
        if (code === nextState.params.moduleCode) {
          isTeacher = true;
          break;
        }
      }

      if (!user || (!isTeacher && !user.admin)) {
        // oops, not logged in or does not have access rights, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    store.dispatch(loadTranslations('en'));

    if (!isAuthLoaded(store.getState())) {
      const result = store.dispatch(loadAuth());
      if (result.then) {
        result.then(checkAuth);
      } else {
        checkAuth();
      }
    } else {
      checkAuth();
    }
  };

  const requireLogin = (nextState, replaceState, cb) => {
    function checkAuth() {
      const { auth: { user }} = store.getState();
      if (!user) {
        // oops, not logged in, so can't be here!
        replaceState(null, '/');
      }
      cb();
    }

    store.dispatch(loadTranslations('en'));

    if (!isAuthLoaded(store.getState())) {
      const result = store.dispatch(loadAuth());
      if (result.then) {
        result.then(checkAuth);
      } else {
        checkAuth();
      }
    } else {
      checkAuth();
    }
  };

  /**
   * Please keep routes in alphabetical order
   */
  return (
    <Route style={{ height: '100%' }} path="/" component={App}>
      { /* Home (main) route */ }
      <IndexRoute component={Home}/>

      { /* Routes requiring login */ }
      <Route onEnter={requireLogin}>
        <Route path="schedule" component={Schedule}/>
        <Route path="profile" component={Profile}/>
        <Route path="modules" component={Modules}/>

        <Route onEnter={requireAdmin} path="course/new" component={CourseEdit} />
        <Route path="course/:courseId" component={Course}>
          <Route path="/" component={CourseInfo} />
          <Route path="info" component={CourseInfo} />
          <Route path="edit" component={CourseEdit} />
          <Route path="class/new" component={ClassNew} />
          <Route path="classes" component={CourseClasses} />
        </Route>

        <Route onEnter={requireAdmin} path="manage/course/:courseId" component={Course}>
          <Route path="modules" component={ManageModules} />
        </Route>

        <Route path="course/:courseId/modules" component={Modules} />
        <Route path="course/:courseId/module/new" component={ModuleEdit} />
        <Route path="course/:courseId/module/:moduleCode" component={Module}>
          <Route path="/" component={ModuleInfo} />
          <Route path="info" component={ModuleInfo} />
          <Route path="edit" component={ModuleEdit} />
          <Route path="materials" component={ModuleMaterials} />
          <Route path="assignments" component={ModuleAssignments} />
          <Route path="grades" component={ModuleGrades} />
          <Route path="lectures" component={ModuleLectures} />
          <Route path="lecture" component={ModuleLecture} />
        </Route>

        <Route onEnter={requireAdmin}>
          <Route path="course/:courseId/class/:classId" component={Manage}>
            <Route path="modules" component={ClassModules} />
          </Route>

          <Route path="course/:courseId/class/:classId/level/:level" component={Level}>
            <Route path="/" component={LevelInfo} />
            <Route path="info" component={LevelInfo} />
            <Route path="modules" component={LevelModules} />
          </Route>

          <Route path="manage" component={Manage}>
            <Route path="/" component={ManageCourses} />
            <Route path="courses" component={ManageCourses} />
            <Route path="module/:moduleCode" component={ManageModule}>
              <Route path="info" component={ManageModuleInfo} />
              <Route path="lectures" component={ManageModuleLectures} />
              <Route path="students" component={ManageModuleStudents} />
              <Route path="assignments" component={ManageModuleAssignments} />
              <Route path="announcements" component={ManageModuleAnnouncements} />
            </Route>
          </Route>
        </Route>

        <Route onEnter={requireTeacher}>
          <Route path="manage/course/:courseId" component={Module}>
            <Route path="module/:moduleCode" component={ManageModule}>
              <IndexRoute component={ManageModuleInfo} />
              <Route path="info" component={ManageModuleInfo} />
              <Route path="lectures" component={ManageModuleLectures} />
              <Route path="students" component={ManageModuleStudents} />
              <Route path="assignments" component={ManageModuleAssignments} />
              <Route path="announcements" component={ManageModuleAnnouncements} />
            </Route>
          </Route>
        </Route>
      </Route>

      { /* Routes */ }
      <Route path="login" component={Login}/>
      <Route path="password/reset/:token" component={ChangePassword}/>
      <Route path="forgot-password" component={ForgotPassword}/>

      { /* Catch all route */ }
      <Route path="*" component={NotFound} status={404} />
    </Route>
  );
};
